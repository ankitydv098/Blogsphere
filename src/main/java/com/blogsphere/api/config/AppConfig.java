package com.blogsphere.api.config;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * General application configuration for BlogSphere.
 *
 * <p>Registers the ModelMapper bean used across all mapper classes
 * and configures static resource serving for uploaded images.</p>
 */
@Configuration
public class AppConfig implements WebMvcConfigurer {

    /**
     * ModelMapper bean configured with STRICT matching strategy.
     *
     * <p>STRICT ensures only exact property name matches are mapped,
     * preventing accidental mapping of similarly-named fields.</p>
     *
     * @return configured ModelMapper instance
     */
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration()
              .setMatchingStrategy(MatchingStrategies.STRICT)
              .setSkipNullEnabled(true);
        return mapper;
    }

    /**
     * Expose uploaded images via /api/images/** URL path.
     *
     * <p>Maps the URL prefix to the local filesystem upload directory
     * so that blog post images can be served directly.</p>
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/api/images/**")
                .addResourceLocations("file:./uploads/images/");
    }
}
