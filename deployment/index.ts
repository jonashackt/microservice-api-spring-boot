import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// Create an AWS resource (S3 Bucket)
// const nuxtBucket = new aws.s3.Bucket("microservice-ui-nuxt-js-hosting-bucket", {
//   acl: "public-read",
//   website: {
//     indexDocument: "index.html",
//   }
// });

// S3 Objects from Nuxt.js static site generation will be added through aws CLI instead of Pulumi like this
// (see https://www.pulumi.com/docs/tutorials/aws/aws-ts-static-website/#deployment-speed):
// aws s3 sync ../dist/ s3://$(pulumi stack output bucketName) --acl public-read

// Export the name of the bucket
// export const bucketName = nuxtBucket.id;
// export const bucketUrl = nuxtBucket.websiteEndpoint;
