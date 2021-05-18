import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";

// Spring Boot Apps port
const port = 8098;

// Create a ApplicationLoadBalancer to listen for requests and route them to the container.
const alb = new awsx.lb.ApplicationLoadBalancer("fargateAlb");

// Create TargetGroup & Listener manually (see https://www.pulumi.com/docs/reference/pkg/nodejs/pulumi/awsx/lb/)
// so that we can configure the TargetGroup HealthCheck as described in (https://www.pulumi.com/docs/guides/crosswalk/aws/elb/#manually-configuring-target-groups)
// otherwise our Spring Boot Containers will be restarted every time, since the TargetGroup HealthChecks Status always
// goes to unhealthy
const albTargetGroup = alb.createTargetGroup("fargateAlbTargetGroup", {
    port: port,
    protocol: "HTTP",
    healthCheck: {
        // Use the default spring-boot-actuator health endpoint
        path: "/actuator/health"
    }
});

const albListener = albTargetGroup.createListener("fargateAlbListener", { port: port, protocol: "HTTP" });

// Define Container image published to the GitHub Container Registry
const service = new awsx.ecs.FargateService("microservice-api-spring-boot", {
    taskDefinitionArgs: {
        containers: {
            microservice_api_spring_boot: {
                image: "ghcr.io/jonashackt/microservice-api-spring-boot:latest",
                memory: 768,
                portMappings: [ albListener ]
            },
        },
    },
    desiredCount: 2,
    forceNewDeployment: true
});

// Export the URL so we can easily access it.
// Since Pulumi uses Input and Output as a kind of Promise, we can't directly access the URL as a String
// see https://www.pulumi.com/docs/intro/concepts/inputs-outputs/#outputs-and-strings
export const apiUrl = pulumi.concat("http://", albListener.endpoint.hostname, ":", port)