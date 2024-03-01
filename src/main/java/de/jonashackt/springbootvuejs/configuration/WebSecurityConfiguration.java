package de.jonashackt.springbootvuejs.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebSecurityConfiguration {

    // see https://docs.spring.io/spring-security/reference/migration-7/configuration.html
    // see https://stackoverflow.com/a/76690450/4964553

    @Bean
    protected SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // No session will be created or used by spring security
            .httpBasic(Customizer.withDefaults())
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/api/hello").permitAll()
                .requestMatchers("/api/user/**").permitAll() // allow every URI, that begins with '/api/user/'
                .requestMatchers("/api/secured").authenticated()
                .anyRequest().permitAll() // allow everything except /secured
                //.anyRequest().authenticated() // protect all other requests
            )
            .cors(Customizer.withDefaults()) // We need to add CORS support to Spring Security (see https://stackoverflow.com/a/67583232/4964553)
            .csrf(csrf -> csrf.disable());// disable cross site request forgery, as we don't use cookies - otherwise ALL PUT, POST, DELETE will get HTTP 403!

        return http.build();
    }

    //@Override
    //protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    //    auth.inMemoryAuthentication()
    //            .withUser("foo").password("{noop}bar").roles("USER");
    //}
}
