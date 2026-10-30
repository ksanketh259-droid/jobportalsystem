package com.jobportal.config;

import com.jobportal.model.*;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.SavedJobRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.security.PasswordUtil;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final SavedJobRepository savedJobRepository;

    public DataInitializer(
            UserRepository userRepository,
            JobRepository jobRepository,
            ApplicationRepository applicationRepository,
            SavedJobRepository savedJobRepository) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.savedJobRepository = savedJobRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Already seeded
        }

        System.out.println(">>> Seeding database with demo users, jobs, and applications...");

        // 1. Create Admin
        User admin = new User();
        admin.setEmail("admin@jobportal.com");
        admin.setPassword(PasswordUtil.hashPassword("admin123"));
        admin.setFullName("Platform Administrator");
        admin.setRole(Role.ADMIN);
        admin.setPhone("+1 (555) 019-2831");
        userRepository.save(admin);

        // 2. Create Employers
        User employer1 = new User();
        employer1.setEmail("recruiter@techcorp.com");
        employer1.setPassword(PasswordUtil.hashPassword("password123"));
        employer1.setFullName("Sarah Jenkins");
        employer1.setRole(Role.EMPLOYER);
        employer1.setCompanyName("TechCorp Global");
        employer1.setCompanyWebsite("https://techcorp.example.com");
        employer1.setCompanyDescription("TechCorp Global is a leading enterprise software provider innovating cloud and AI services worldwide.");
        employer1.setPhone("+1 (555) 345-6789");
        employer1 = userRepository.save(employer1);

        User employer2 = new User();
        employer2.setEmail("hiring@innovate.co");
        employer2.setPassword(PasswordUtil.hashPassword("password123"));
        employer2.setFullName("Marcus Vance");
        employer2.setRole(Role.EMPLOYER);
        employer2.setCompanyName("Innovate Labs");
        employer2.setCompanyWebsite("https://innovatelabs.example.com");
        employer2.setCompanyDescription("Innovate Labs builds cutting-edge consumer AI applications and human-centered design systems.");
        employer2.setPhone("+1 (555) 789-0123");
        employer2 = userRepository.save(employer2);

        // 3. Create Candidates
        User seeker1 = new User();
        seeker1.setEmail("seeker@example.com");
        seeker1.setPassword(PasswordUtil.hashPassword("password123"));
        seeker1.setFullName("Alex Morgan");
        seeker1.setRole(Role.JOB_SEEKER);
        seeker1.setTitle("Senior Full-Stack Engineer");
        seeker1.setBio("Passionate full-stack developer with 5+ years building resilient microservices, modern single-page apps, and cloud native architectures.");
        seeker1.setSkills("Java, Spring Boot, React, TypeScript, Docker, Kubernetes, PostgreSQL, REST APIs");
        seeker1.setExperienceYears(5);
        seeker1.setEducation("B.S. in Computer Science - University of California");
        seeker1.setPhone("+1 (555) 432-1098");
        seeker1 = userRepository.save(seeker1);

        User seeker2 = new User();
        seeker2.setEmail("priya@example.com");
        seeker2.setPassword(PasswordUtil.hashPassword("password123"));
        seeker2.setFullName("Priya Sharma");
        seeker2.setRole(Role.JOB_SEEKER);
        seeker2.setTitle("Data Scientist & Machine Learning Specialist");
        seeker2.setBio("Machine learning practitioner focused on LLM fine-tuning, predictive modeling, and scalable feature engineering.");
        seeker2.setSkills("Python, PyTorch, Scikit-learn, SQL, Docker, FastApi, Pandas, Spark");
        seeker2.setExperienceYears(3);
        seeker2.setEducation("M.S. in Data Science - Georgia Tech");
        seeker2.setPhone("+1 (555) 987-6543");
        seeker2 = userRepository.save(seeker2);

        // 4. Create Jobs
        Job job1 = new Job();
        job1.setTitle("Senior Full-Stack Java Engineer");
        job1.setCompany("TechCorp Global");
        job1.setLocation("Remote (USA / Canada)");
        job1.setCategory("Engineering");
        job1.setJobType(JobType.REMOTE);
        job1.setExperienceLevel(ExperienceLevel.SENIOR);
        job1.setSalaryMin(135000.0);
        job1.setSalaryMax(165000.0);
        job1.setCurrency("$");
        job1.setDescription("We are seeking a talented Senior Full-Stack Java Engineer to architect and build mission-critical distributed systems. You will collaborate closely with product management and platform architects to deliver resilient, highly scalable cloud solutions.");
        job1.setRequirements("• 5+ years of production experience with Java and Spring Boot\n• Strong frontend proficiency with React, TypeScript, and modern CSS\n• Deep understanding of relational databases (PostgreSQL/MySQL) and query optimization\n• Familiarity with containerization (Docker, Kubernetes) and CI/CD pipelines");
        job1.setResponsibilities("• Lead technical architecture and development of core business APIs\n• Build responsive, accessible user interfaces using React\n• Mentor junior team members and conduct rigorous code reviews\n• Collaborate with security and DevOps teams to maintain high standards of uptime and security");
        job1.setBenefits("• Comprehensive health, dental, and vision insurance (100% company-paid)\n• $2,500 annual home office & learning stipend\n• Flexible PTO and parental leave\n• 401(k) matching up to 5%");
        job1.setStatus(JobStatus.OPEN);
        job1.setEmployer(employer1);
        job1 = jobRepository.save(job1);

        Job job2 = new Job();
        job2.setTitle("Frontend React Developer");
        job2.setCompany("TechCorp Global");
        job2.setLocation("Bengaluru, India");
        job2.setCategory("Engineering");
        job2.setJobType(JobType.FULL_TIME);
        job2.setExperienceLevel(ExperienceLevel.MID_LEVEL);
        job2.setSalaryMin(85000.0);
        job2.setSalaryMax(110000.0);
        job2.setCurrency("$");
        job2.setDescription("TechCorp is looking for a creative Frontend React Developer who cares about craftsmanship, user delight, and performance. You will be responsible for creating modern web experiences across our suite of enterprise products.");
        job2.setRequirements("• 3+ years experience with modern React, Hooks, and State Management\n• Proficiency with HTML5, CSS3, TailwindCSS, and responsive design\n• Experience consuming RESTful APIs and WebSocket data streams\n• Understanding of web performance audits and accessibility standards");
        job2.setResponsibilities("• Implement pixel-perfect designs with fluid micro-interactions\n• Optimize client-side rendering performance and bundle sizes\n• Write clean, testable unit and integration tests (Jest, React Testing Library)");
        job2.setBenefits("• Health coverage for employee and dependents\n• Annual wellness allowance\n• Hybrid working schedule\n• Sponsored conference attendance");
        job2.setStatus(JobStatus.OPEN);
        job2.setEmployer(employer1);
        job2 = jobRepository.save(job2);

        Job job3 = new Job();
        job3.setTitle("AI / Machine Learning Engineer");
        job3.setCompany("Innovate Labs");
        job3.setLocation("San Francisco, CA");
        job3.setCategory("Data & AI");
        job3.setJobType(JobType.FULL_TIME);
        job3.setExperienceLevel(ExperienceLevel.SENIOR);
        job3.setSalaryMin(155000.0);
        job3.setSalaryMax(195000.0);
        job3.setCurrency("$");
        job3.setDescription("Innovate Labs is pioneering intelligent user workflows. We are looking for an ML Engineer to develop, fine-tune, and deploy state-of-the-art models for semantic search, recommendation algorithms, and automated workflows.");
        job3.setRequirements("• Strong foundation in machine learning, NLP, and transformer architectures\n• Hands-on proficiency with PyTorch, Hugging Face, and Python\n• Experience productionizing models with FastAPI, Triton, or ONNX\n• Track record of deploying scalable ML inference services in cloud environments");
        job3.setResponsibilities("• Design and execute experiments to benchmark embedding and classification models\n• Optimize model latency and throughput for live user requests\n• Partner with product designers to evaluate qualitative model outputs");
        job3.setBenefits("• Competitive base salary + equity stock options\n• Catered daily lunch and gourmet snacks\n• Generous commuter benefits\n• Annual learning budget");
        job3.setStatus(JobStatus.OPEN);
        job3.setEmployer(employer2);
        job3 = jobRepository.save(job3);

        Job job4 = new Job();
        job4.setTitle("DevOps & Cloud Infrastructure Architect");
        job4.setCompany("TechCorp Global");
        job4.setLocation("New York, NY");
        job4.setCategory("DevOps");
        job4.setJobType(JobType.FULL_TIME);
        job4.setExperienceLevel(ExperienceLevel.LEAD);
        job4.setSalaryMin(150000.0);
        job4.setSalaryMax(185000.0);
        job4.setCurrency("$");
        job4.setDescription("Join us to lead cloud infrastructure initiatives across AWS and multi-cloud environments. You will drive automated provisioning, observability, and zero-downtime deployment pipelines.");
        job4.setRequirements("• 6+ years in DevOps / Infrastructure engineering\n• Mastery of Terraform, AWS services (EKS, RDS, CloudFront), and Helm\n• Deep expertise with monitoring and alerting tools (Prometheus, Grafana, Datadog)\n• Strong background in cybersecurity best practices and SOC2 compliance");
        job4.setResponsibilities("• Manage production Kubernetes clusters with high availability\n• Implement Infrastructure as Code (IaC) across all environments\n• Participate in on-call rotation and lead root cause analysis post-mortems");
        job4.setBenefits("• 401(k) with company match\n• Unlimited paid time off\n• Comprehensive health package\n• Top-tier hardware setup of your choice");
        job4.setStatus(JobStatus.OPEN);
        job4.setEmployer(employer1);
        jobRepository.save(job4);

        Job job5 = new Job();
        job5.setTitle("Lead Product Designer (UI/UX)");
        job5.setCompany("Innovate Labs");
        job5.setLocation("Remote");
        job5.setCategory("Design");
        job5.setJobType(JobType.REMOTE);
        job5.setExperienceLevel(ExperienceLevel.SENIOR);
        job5.setSalaryMin(120000.0);
        job5.setSalaryMax(150000.0);
        job5.setCurrency("$");
        job5.setDescription("We believe world-class software stems from intuitive, beautiful design. We are looking for a Lead UI/UX Designer to own our product design system and user journey maps.");
        job5.setRequirements("• 5+ years designing enterprise or SaaS product experiences\n• Mastery of Figma, design systems, and rapid interactive prototyping\n• Ability to translate complex user workflows into simple, elegant interfaces\n• Strong portfolio demonstrating user research and aesthetic excellence");
        job5.setResponsibilities("• Lead end-to-end user experience design from wireframes to high-fidelity specs\n• Maintain and evolve our multi-platform design tokens\n• Run user interviews, usability tests, and synthesize qualitative feedback");
        job5.setBenefits("• 100% remote working flexibility\n• Equipment stipend\n• Generous health care coverage\n• Paid creative sabbaticals");
        job5.setStatus(JobStatus.OPEN);
        job5.setEmployer(employer2);
        jobRepository.save(job5);

        Job job6 = new Job();
        job6.setTitle("Junior Java Developer / Intern");
        job6.setCompany("TechCorp Global");
        job6.setLocation("Bengaluru, India");
        job6.setCategory("Engineering");
        job6.setJobType(JobType.INTERNSHIP);
        job6.setExperienceLevel(ExperienceLevel.ENTRY_LEVEL);
        job6.setSalaryMin(30000.0);
        job6.setSalaryMax(45000.0);
        job6.setCurrency("$");
        job6.setDescription("Jumpstart your career with hands-on enterprise Java development. You will receive 1-on-1 mentorship from senior engineers and contribute directly to live microservices.");
        job6.setRequirements("• Degree in Computer Science or final year student\n• Solid grasp of Object-Oriented Programming (Java)\n• Basic familiarity with Spring Boot and SQL databases\n• Eagerness to learn, ask questions, and write quality code");
        job6.setResponsibilities("• Implement unit tests and bug fixes under guidance\n• Participate in daily standups and sprint planning\n• Document API endpoints and write technical notes");
        job6.setBenefits("• Dedicated mentorship program\n• Conversion opportunity to full-time role upon completion\n• Flexible schedule during examination periods");
        job6.setStatus(JobStatus.OPEN);
        job6.setEmployer(employer1);
        jobRepository.save(job6);

        // 5. Create Sample Applications
        Application app1 = new Application();
        app1.setJob(job1);
        app1.setApplicant(seeker1);
        app1.setApplicantEmail(seeker1.getEmail());
        app1.setApplicantPhone(seeker1.getPhone());
        app1.setCoverLetter("Dear Hiring Team at TechCorp Global,\n\nI am thrilled to apply for the Senior Full-Stack Java Engineer position. With 5 years of hands-on experience scaling Spring Boot microservices and creating reactive interfaces with React, I am confident in my ability to make an immediate impact on your product roadmap.\n\nLooking forward to speaking with you!\nAlex Morgan");
        app1.setStatus(ApplicationStatus.SHORTLISTED);
        app1.setEmployerNotes("Impressive profile and GitHub repositories. Shortlisted for Technical Round 1.");
        app1.setInterviewDate(LocalDateTime.now().plusDays(2).withHour(15).withMinute(0));
        applicationRepository.save(app1);

        Application app2 = new Application();
        app2.setJob(job3);
        app2.setApplicant(seeker2);
        app2.setApplicantEmail(seeker2.getEmail());
        app2.setApplicantPhone(seeker2.getPhone());
        app2.setCoverLetter("Hello Innovate Labs Team,\n\nI have followed your work in AI workflows with great admiration. Having developed neural inference pipelines and transformer fine-tuning scripts, I am eager to contribute to your model optimization and semantic search engines.\n\nBest regards,\nPriya Sharma");
        app2.setStatus(ApplicationStatus.UNDER_REVIEW);
        app2.setEmployerNotes("Reviewing portfolio and machine learning thesis.");
        applicationRepository.save(app2);

        // 6. Save a job bookmark for seeker1
        savedJobRepository.save(new SavedJob(seeker1, job2));

        System.out.println(">>> Demo data seeded successfully!");
    }
}
