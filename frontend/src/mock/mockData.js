// Mock Dataset for BlogSphere — Ankit Kumar's Developer Portfolio

export const ANKIT = {
  id: 1,
  name: 'Ankit Kumar',
  email: 'ankit@blogsphere.com',
  role: 'ROLE_ADMIN',
  avatar: null, // Using initials avatar — no fake Unsplash photo
  coverImage: 'https://images.unsplash.com/photo-1607705703571-c5a8695f18f6?auto=format&fit=crop&w=1400&q=80',
  bio: "I'm a passionate Java Backend Developer and Computer Science student focused on Spring Boot, REST APIs, System Design, and DSA. I enjoy building production-ready backend systems and continuously improving my software engineering skills. Currently looking for Software Development Internship opportunities.",
  role_label: 'Java Backend Developer',
  college: 'Haldia Institute of Technology',
  specialization: 'Computer Science Engineering (Cyber Security)',
  location: 'West Bengal, India',
  github: 'https://github.com/ankitydv098',
  linkedin: 'https://linkedin.com/in/ankitkumar',
  email_contact: 'ankitydv098@gmail.com',
  website: 'https://github.com/ankitydv098',
};

export const INITIAL_USERS = [ANKIT];

export const ANKIT_SKILLS = [
  'Java', 'Spring Boot', 'Spring Security', 'JWT',
  'MySQL', 'Docker', 'Git', 'GitHub',
  'REST API', 'Hibernate', 'JPA', 'DSA',
];

export const ANKIT_ACHIEVEMENTS = [
  { icon: 'Code2', label: '100+ LeetCode Problems', desc: 'Solved across Arrays, Trees, DP, Graphs' },
  { icon: 'Trophy', label: 'HackForBengal Participant', desc: 'Regional hackathon, 2024' },
  { icon: 'Award', label: 'Smart India Hackathon', desc: 'National-level participation, 2024' },
  { icon: 'Github', label: 'Open Source Learner', desc: 'Contributing to open-source Java projects' },
];

export const ANKIT_STATS = [
  { value: '6', label: 'Articles Written' },
  { value: '100+', label: 'LeetCode Problems' },
  { value: '2', label: 'Hackathons' },
  { value: '12+', label: 'GitHub Repos' },
];

export const INITIAL_CATEGORIES = [
  { id: 1, categoryName: 'Java & Spring Boot', description: 'Core Java 21, Virtual Threads, Spring Boot 3.x, and Spring Security 6 architecture.' },
  { id: 2, categoryName: 'System Architecture', description: 'Distributed systems, database design, caching, microservices, and high scale systems.' },
  { id: 3, categoryName: 'AI & Machine Learning', description: 'Generative AI, LLMs, RAG architectures, Spring AI, and AI agent engineering.' },
  { id: 4, categoryName: 'DevOps & Cloud', description: 'Docker, Kubernetes, CI/CD pipelines, AWS, infrastructure as code, and observability.' },
  { id: 5, categoryName: 'Frontend & Web Dev', description: 'React 19, Vite, Tailwind CSS, state management, and modern Web performance.' },
  { id: 6, categoryName: 'Engineering Culture', description: 'Clean code, software craftsmanship, system design interviews, and developer productivity.' },
];

export const INITIAL_POSTS = [
  {
    id: 101,
    title: 'Complete Java 21 Features Roadmap & Virtual Threads Deep Dive',
    slug: 'complete-java-21-virtual-threads-roadmap',
    content: `Java 21 represents one of the most monumental LTS releases in the history of the Java ecosystem. At the forefront of this release is **Project Loom (Virtual Threads)**, which completely rewrites how Java applications handle high-concurrency workloads.

### What are Virtual Threads?

Traditionally, Java threads (\`java.lang.Thread\`) were OS-level threads managed directly by the underlying operating system kernel. Creating tens of thousands of OS threads leads to severe memory overhead and frequent context switches.

Virtual threads, on the other hand, are lightweight user-mode threads managed by the JVM runtime.

\`\`\`java
// Creating a Virtual Thread in Java 21
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 10_000).forEach(i -> {
        executor.submit(() -> {
            Thread.sleep(Duration.ofSeconds(1));
            return i;
        });
    });
} // Executor automatically waits for all tasks to complete!
\`\`\`

### Key Features Covered in Java 21

1. **Virtual Threads (JEP 444)**: Handle millions of concurrent requests with minimal RAM.
2. **Sequenced Collections (JEP 431)**: Encounter order with \`getFirst()\`, \`getLast()\`, and reversed views.
3. **Record Patterns (JEP 440)**: Deconstruct record values directly inside \`switch\` statements.
4. **Pattern Matching for Switch (JEP 441)**: Concise pattern-based branching with null safety.

### Performance Benchmarks

In tests comparing standard platform threads versus Virtual Threads under 50,000 parallel blocking HTTP requests, Virtual Threads achieved **95% reduction in memory usage** and sustained 4.5x higher throughput without thread exhaustion!`,
    imageName: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-07-18T10:30:00Z',
    readTime: '6 min read',
    claps: 342,
    bookmarksCount: 89,
    category: INITIAL_CATEGORIES[0],
    user: ANKIT,
    tags: ['Java 21', 'Virtual Threads', 'Concurrency', 'JVM', 'Backend'],
  },
  {
    id: 102,
    title: 'Spring Security 6 & JWT — Complete Stateless Authorization Tutorial',
    slug: 'spring-security-6-jwt-stateless-authorization',
    content: `With the release of Spring Boot 3 and Spring Security 6, traditional configuration patterns using \`WebSecurityConfigurerAdapter\` have been completely removed in favor of component-based bean declarations using \`SecurityFilterChain\`.

### Key Changes in Spring Security 6

- **Component-Based Configuration**: Declare a \`SecurityFilterChain\` bean instead of extending adapter classes.
- **Method-Level Security**: Refactored \`@EnableMethodSecurity\` replacing \`@EnableGlobalMethodSecurity\`.
- **Lambda DSL Syntax**: Clearer, inline configuration using functional lambdas.

### Implementation Blueprint

\`\`\`java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(Customizer.withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/api/posts/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
\`\`\`

By configuring a stateless session strategy and injecting a custom \`JwtAuthenticationFilter\`, your Spring Boot REST APIs gain enterprise-grade token validation with minimal overhead.`,
    imageName: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-07-19T14:15:00Z',
    readTime: '8 min read',
    claps: 512,
    bookmarksCount: 145,
    category: INITIAL_CATEGORIES[0],
    user: ANKIT,
    tags: ['Spring Security 6', 'Spring Boot 3', 'JWT', 'Security', 'REST API'],
  },
  {
    id: 103,
    title: 'Tech Ecosystem & Software Engineering Innovation in India',
    slug: 'tech-ecosystem-software-engineering-growth-india',
    content: `India's technology sector has evolved far beyond traditional IT outsourcing into a powerhouse of core backend engineering, SaaS unicorns, and open-source innovation.

### Major Tech Hubs & Specializations

- **Bengaluru**: The Silicon Valley of India, housing global R&D labs for Google, Microsoft, and massive engineering teams building distributed databases.
- **Hyderabad**: High-availability cloud backend infrastructure, security engineering, and enterprise Java development.
- **Pune & NCR**: Cloud-native DevOps, AI startup incubators, and high-frequency trading backend systems.

### High-Scale Architecture Trends in Indian Tech Unicorns

From processing 10 billion+ monthly UPI transactions with sub-second latency to managing real-time logistics for millions of daily orders, Indian tech platforms rely heavily on:

1. **Spring Boot & Java 21**: Core transactional microservices.
2. **Kafka & Event-Driven Pipelines**: Asynchronous message routing.
3. **Redis & Distributed Caching**: Low-latency session management and rate limiting.
4. **Kubernetes Multi-Cluster Deployments**: Zero-downtime rolling updates.`,
    imageName: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-07-20T09:00:00Z',
    readTime: '5 min read',
    claps: 428,
    bookmarksCount: 110,
    category: INITIAL_CATEGORIES[5],
    user: ANKIT,
    tags: ['India', 'Tech Growth', 'Architecture', 'Engineering Culture', 'Java'],
  },
  {
    id: 104,
    title: 'System Architecture: Designing Resilient Microservices & Database Sharding',
    slug: 'system-architecture-resilient-microservices-sharding',
    content: `When scaling applications to handle millions of active requests per minute, a single relational database instance quickly becomes a severe bottleneck. Modern system design relies on **Database Sharding**, **Read Replicas**, and **Circuit Breakers**.

### Core Architectural Patterns

- **Horizontal Sharding**: Partitioning data across multiple database nodes using a shard key (e.g. \`user_id % 16\`).
- **Resilience4j Circuit Breakers**: Preventing cascading failures when downstream microservices degrade.
- **Outbox Pattern**: Guaranteeing atomic database writes alongside Kafka event publishing.

### Sharding Architecture Diagram

\`\`\`
Client Request -> API Gateway -> Load Balancer
                                   |
                  +----------------+----------------+
                  |                                 |
           Service Instance A                Service Instance B
                  |                                 |
         Consistent Hash Router            Consistent Hash Router
         /        |        \\              /        |        \\
      Shard 1  Shard 2   Shard 3       Shard 1  Shard 2   Shard 3
\`\`\`

Implementing this architecture ensures 99.999% availability even during regional cloud outages!`,
    imageName: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-07-21T08:20:00Z',
    readTime: '10 min read',
    claps: 620,
    bookmarksCount: 205,
    category: INITIAL_CATEGORIES[1],
    user: ANKIT,
    tags: ['System Architecture', 'Microservices', 'Database Sharding', 'Scalability'],
  },
  {
    id: 105,
    title: 'Spring AI & LLMs: Building Retrieval-Augmented Generation (RAG) Apps',
    slug: 'spring-ai-building-rag-applications-java',
    content: `Python is no longer the sole choice for building Generative AI applications. With **Spring AI**, Java developers can now integrate LLMs like OpenAI, Anthropic Claude, and Google Gemini into enterprise Spring Boot applications using fluent, idiomatic Java code.

### What is Retrieval-Augmented Generation (RAG)?

RAG bridges the gap between private enterprise documents and public LLMs. By converting company documents into vector embeddings and storing them in a Vector Database (like PgVector, Milvus, or Pinecone), we can inject relevant context into LLM prompts at runtime.

\`\`\`java
@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final ChatClient chatClient;

    public AiController(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    @GetMapping("/ask")
    public String ask(@RequestParam String question) {
        return chatClient.prompt()
                .user(question)
                .call()
                .content();
    }
}
\`\`\`

Spring AI handles prompt formatting, vector store embedding searches, and response parsing out of the box!`,
    imageName: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-07-21T11:45:00Z',
    readTime: '7 min read',
    claps: 290,
    bookmarksCount: 78,
    category: INITIAL_CATEGORIES[2],
    user: ANKIT,
    tags: ['Spring AI', 'AI', 'LLM', 'RAG', 'Java'],
  },
  {
    id: 106,
    title: 'Docker & Kubernetes Mastery for Java Developers',
    slug: 'docker-kubernetes-mastery-java-developers',
    content: `Containerizing Spring Boot applications for production requires optimizing Dockerfiles with multi-stage builds, JLink custom JREs, and proper Kubernetes resource limits.

### Multi-Stage Dockerfile Blueprint

\`\`\`dockerfile
# Build Stage
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

# Runtime Stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-XX:+UseG1GC", "-jar", "app.jar"]
\`\`\`

By separating build dependencies from the runtime image, the final container size drops from 650MB down to under 180MB!`,
    imageName: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-07-17T16:00:00Z',
    readTime: '6 min read',
    claps: 195,
    bookmarksCount: 62,
    category: INITIAL_CATEGORIES[3],
    user: ANKIT,
    tags: ['Docker', 'Kubernetes', 'DevOps', 'Spring Boot', 'Containers'],
  },
];

export const INITIAL_COMMENTS = [
  {
    id: 1,
    postId: 101,
    user: ANKIT,
    content: 'Virtual Threads in Java 21 have been a game changer for building high-concurrency backends. Great deep dive into thread context switching costs!',
    createdAt: '2026-07-18T12:00:00Z',
    likesCount: 14,
  },
  {
    id: 2,
    postId: 102,
    user: ANKIT,
    content: 'The new SecurityFilterChain configuration model in Spring Security 6 is so much cleaner than the old adapter pattern. Thanks for the tutorial!',
    createdAt: '2026-07-19T18:20:00Z',
    likesCount: 21,
  },
];

export const TRENDING_TOPICS = [
  { id: 1, title: 'Spring Security 6', query: 'Spring Security 6', count: '1.4k reads', desc: 'Stateless APIs, SecurityFilterChain, and JWT patterns.' },
  { id: 2, title: 'Java 21 Virtual Threads', query: 'Java 21', count: '2.8k reads', desc: 'Project Loom concurrency & high-throughput JVM benchmarks.' },
  { id: 3, title: 'India Tech Innovation', query: 'India', count: '3.1k reads', desc: 'Software engineering & developer community growth in India.' },
  { id: 4, title: 'System Architecture', query: 'System Architecture', count: '1.9k reads', desc: 'Microservices sharding, database resilience & event pipelines.' },
  { id: 5, title: 'Spring AI & RAG', query: 'Spring AI', count: '950 reads', desc: 'Integrating LLMs, PgVector & document embedding in Java.' },
];
