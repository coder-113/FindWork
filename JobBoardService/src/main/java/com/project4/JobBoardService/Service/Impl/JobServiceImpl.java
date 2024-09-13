package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.Config.ResourceNotFoundException;
import com.project4.JobBoardService.DTO.CategoryDTO;
import com.project4.JobBoardService.DTO.JobDTO;
import com.project4.JobBoardService.Entity.*;
import com.project4.JobBoardService.Enum.ContractType;
import com.project4.JobBoardService.Enum.JobType;
import com.project4.JobBoardService.Enum.Position;
import com.project4.JobBoardService.Enum.WorkSchedule;
import com.project4.JobBoardService.Repository.*;
import com.project4.JobBoardService.Service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

//@CacheConfig(cacheNames = "job")
@Service
public class JobServiceImpl implements JobService {
    private final JobRepository jobRepository;
    private final CategoryService categoryService;
    private final UserService userService;
    private final TransactionService transactionService;
    private  final CategoryRepository categoryRepository;

    @Autowired
    TrendingSkillRepository trendingSkillRepository;
    @Autowired
    private TransactionRepository transactionRepository;


    @Autowired
    public JobServiceImpl(JobRepository jobRepository , CompanyService companyService, CategoryService categoryService, UserService userService, TransactionService transactionService, CategoryRepository categoryRepository) {
        this.jobRepository = jobRepository;
        this.categoryService = categoryService;
        this.userService = userService;
        this.transactionService=transactionService;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<JobDTO> findAllJobsByCompanyId(Long userId) {
        List<Job> jobs = jobRepository.findAllByUserId(userId);
        return jobs.stream().map(this::convertToDto).collect(Collectors.toList());
    }

//    @Override
//    public List<JobDTO> getAllJobs() {
//        LocalDate today = LocalDate.now();
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
//        List<Job> jobs = jobRepository.findAll();
//        return jobs.stream()
//                .filter(job -> {
//                    LocalDate expireDate = LocalDate.parse(job.getExpire(), formatter);
//                    boolean notExpired = today.isBefore(expireDate);
//                    boolean slotsAvailable = job.getProfileApproved() < job.getSlot();
//                    return notExpired && slotsAvailable;
//                })
//                .sorted(Comparator.comparing(Job::getCreatedAt).reversed())
//                .map(this::convertToDto)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public List<Job> getAllJob() {
//        LocalDate today = LocalDate.now();
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
//        List<Job> jobs = jobRepository.findAll();
//        return jobs.stream()
//                .filter(job -> {
//                    LocalDate expireDate = LocalDate.parse(job.getExpire(), formatter);
//                    boolean notExpired = today.isBefore(expireDate);
//                    boolean slotsAvailable = job.getProfileApproved() < job.getSlot();
//                    return notExpired && slotsAvailable;
//                })
//                .sorted(Comparator.comparing(Job::getCreatedAt).reversed())
//                .collect(Collectors.toList());
//    }

    public List<Job> filterAndSortJobs(List<Job> jobs) {
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        return jobs.stream()
                .filter(job -> {
                    LocalDate expireDate = LocalDate.parse(job.getExpire(), formatter);
                    boolean notExpired = today.isBefore(expireDate);
                    boolean slotsAvailable = job.getProfileApproved() < job.getSlot();
                    return notExpired && slotsAvailable;
                })
                .sorted(Comparator.comparing(Job::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    @Cacheable(cacheNames = "AllJ")
    @Override
    public List<JobDTO> getAllJobs() {
        List<Job> jobs = jobRepository.findAll();
        List<Job> filteredAndSortedJobs = filterAndSortJobs(jobs);
        return filteredAndSortedJobs.stream()
                .map(this::convertToDto)  // Chuyển đổi từ Entity sang DTO
                .collect(Collectors.toList());
    }

    @Override
    public List<Job> getAllJob() {
        List<Job> jobs = jobRepository.findAll();
        return filterAndSortJobs(jobs);
    }


    public List<JobDTO> searchJobsByCompanyId(Long userId, String query) {
        List<Job> jobs = jobRepository.findByUser_IdAndTitleContaining(userId, query);
        return jobs.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Override
    public int countJobsForUserInMonth(Long userId, int year, int month) {
        return jobRepository.countJobsByUserIdAndMonth(userId, year, month);
    }

    @Override
    public int countJobsForUserInCurrentMonth(Long userId) {
        return jobRepository.countJobsForUserInCurrentMonth(userId);
    }

    public List<JobDTO> filterJobsByExpirationStatus(Long userId, boolean isExpired) {
        LocalDate currentDate = LocalDate.now();
        if (isExpired) {
            List<Job> expiredJobs = jobRepository.findByUser_IdAndExpiredBefore(userId, currentDate);
            return expiredJobs.stream().map(this::convertToDto).collect(Collectors.toList());
        } else {
            List<Job> activeJobs = jobRepository.findByUser_IdAndExpiredAfter(userId, currentDate);
            return activeJobs.stream().map(this::convertToDto).collect(Collectors.toList());
        }
    }

    @Override
    public Optional<JobDTO> findJobById(Long jobId) {
        Optional<Job> job = jobRepository.findById(jobId);
        return job.map(this::convertToDto);
    }
    /*  @Override
      public Integer countJobsByCompanyId(Long companyId) {
          return jobRepository.countByCompanyId(companyId);
      }
  */
    public boolean createJob(Long userId, JobDTO jobDTO) {
        Optional<User> userOptional = userService.findById(userId);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            int jobCountThisMonth = jobRepository.countJobsByUserIdAndMonth(userId, LocalDate.now().getYear(), LocalDate.now().getMonthValue());

            // Lấy Subscription hiện tại của người dùng
            Optional<Subscription> subscriptionOptional = transactionService.findActiveSubscriptionByUser(user, LocalDate.now());

            System.out.println(subscriptionOptional);

            // Xác định số lượng bài đăng tối đa dựa trên Subscription
            int maxPosts = subscriptionOptional.map(Subscription::getPostLimit).orElse(10); // 10 nếu không có subscription

            if (jobCountThisMonth >= maxPosts) {
                return false;
            }

            List<String> services = transactionRepository.findServicesByUserId(userId);

// Xác định isSuperHot dựa trên dịch vụ
            boolean isSuperHot = services.contains("HOT");

            // Lấy các Category từ danh sách categoryIds
            Set<Category> categories = new HashSet<>();
            for (Long categoryId : jobDTO.getCategoryId()) {
                categoryRepository.findById(categoryId).ifPresent(categories::add);
            }

            // Tạo đối tượng Job từ DTO
            Job job = convertJobToEntity(jobDTO, categories,isSuperHot);
            job.setUser(user); // Thiết lập User cho Job
            job.setIsSuperHot(isSuperHot); // Thiết lập isSuperHot

            // Lưu job vào repository
            jobRepository.save(job);
            return true;
        } else {
            return false;
        }
    }



    public JobDTO updateJob(Long jobId, JobDTO jobDTO) {
        Optional<Job> jobOptional = jobRepository.findById(jobId);

        if (jobOptional.isPresent()) {
            Job existingJob = jobOptional.get();
            // Retrieve the Company entity based on companyId

            // Cập nhật các thuộc tính từ JobDTO vào existingJob
            existingJob.setTitle(jobDTO.getTitle());
            existingJob.setOfferedSalary(jobDTO.getOfferedSalary());
            existingJob.setDescription(jobDTO.getDescription());
            existingJob.setCity(jobDTO.getCity());
            existingJob.setResponsibilities(jobDTO.getResponsibilities());
            existingJob.setBenefit(jobDTO.getBenefit());
            existingJob.setRequiredSkills(jobDTO.getRequiredSkills());
            existingJob.setWorkSchedule(jobDTO.getWorkSchedule());

            existingJob.setPosition(Position.INTERN);
            existingJob.setPosition(Position.FRESHER);
            existingJob.setPosition(Position.MIDDLE);
            existingJob.setPosition(Position.JUNIOR);
            existingJob.setPosition(Position.LEADER);
            existingJob.setPosition(Position.SENIOR);
            existingJob.setPosition(Position.MANAGER);
            existingJob.setJobType(JobType.IN_OFFICE);
            existingJob.setJobType(JobType.OVERSEA);
            existingJob.setJobType(JobType.REMOTE);
            existingJob.setJobType(JobType.HYBRID);
            existingJob.setContractType(ContractType.FULLTIME);
            existingJob.setContractType(ContractType.FREELANCE);
            existingJob.setContractType(ContractType.PART_TIME);
            existingJob.setExperience(jobDTO.getExperience());
            existingJob.setSlot(jobDTO.getSlot());
            existingJob.setExpire(jobDTO.getExpire());

            existingJob.setBenefit(jobDTO.getBenefit());
            existingJob.setQualification(jobDTO.getQualification());
//            existingJob.setCategoryId(jobDTO.getCategoryId());

            // Lưu lại công việc đã cập nhật vào cơ sở dữ liệu
            jobRepository.save(existingJob);

            // Chuyển đổi từ Job entity sang JobDTO để trả về
            return convertToDto(existingJob);
        } else {
            throw new EntityNotFoundException("Job not found with id: " + jobId);
        }

    }

    private Job convertJobToEntity(JobDTO jobDTO, Set<Category> categories, boolean isSuperHot) {
        Job job = new Job();

        job.setTitle(jobDTO.getTitle());
        job.setOfferedSalary(jobDTO.getOfferedSalary());
        job.setDescription(jobDTO.getDescription());
        job.setCity(jobDTO.getCity());
        job.setResponsibilities(jobDTO.getResponsibilities());
        job.setRequiredSkills(jobDTO.getRequiredSkills());
        job.setWorkSchedule(jobDTO.getWorkSchedule());
        job.setBenefit(jobDTO.getBenefit());
        job.setSlot(jobDTO.getSlot());
        job.setPosition(Position.fromString(jobDTO.getPosition()));

        job.setJobType(JobType.fromString(jobDTO.getJobType()));

        job.setContractType(ContractType.fromString(jobDTO.getContractType()));

        job.setExperience(jobDTO.getExperience());
        if (jobDTO.getCompanyId() != null) {
            Company company = new Company();
            company.setCompanyId(jobDTO.getCompanyId());
            job.setCompany(company);
        }


        job.setCategories(categories);
        job.setQualification(jobDTO.getQualification());
        if (job.getIsHidden() == null) {
            job.setIsHidden(false); // or true, depending on your requirements
        }
        job.setExpire(jobDTO.getExpire());
        job.setCreatedAt(jobDTO.getCreatedAt());
        LocalDateTime createdAt = jobDTO.getCreatedAt() != null ? jobDTO.getCreatedAt() : LocalDateTime.now();
        job.setExpired(createdAt.plusDays(7));
        job.setIsSuperHot(isSuperHot); // Thiết lập isSuperHot
        return job;
    }

    @Override
    public List<JobDTO> getSuperHotJobs() {
        // Get list of hot skills from TrendingSkill
        List<TrendingSkill> trendingSkills = trendingSkillRepository.findAll();
        Set<String> trendingSkillNames = trendingSkills.stream()
                .map(TrendingSkill::getSkillName)
                .collect(Collectors.toSet());

        // Get all jobs from jobRepository
//        List<Job> jobs = jobRepository.findAll();
        List<Job> jobs = getAllJob();

        // Process and filter the job list according to the required conditions
        return jobs.stream()
                .filter(job -> {
                    // Filter jobs by hot skills
                    boolean hasTrendingSkill = job.getCategories().stream()
                            .anyMatch(category -> trendingSkillNames.contains(category.getCategoryName()));
                    // Filter jobs by number of slots
                    boolean hasSufficientSlots = job.getSlot() >= 10;
                    // Filter jobs by offeredSalary
                    boolean hasHighSalary = getSalaryFromString(job.getOfferedSalary()) >= 2000;
                    return hasTrendingSkill || hasSufficientSlots || hasHighSalary;
                })
                .sorted(Comparator.comparing(Job::getCreatedAt).reversed())
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }



    private int getSalaryFromString(String salaryString) {
        Pattern pattern = Pattern.compile("\\d+");
        Matcher matcher = pattern.matcher(salaryString);

        if (matcher.find()) {
            String numberString = matcher.group();
            try {
                return Integer.parseInt(numberString);
            } catch (NumberFormatException e) {
                // If conversion is not possible, return 0
                return 0;
            }
        }
        // If the number is not found, return 0
        return 0;
    }

    @Override
    public void deleteJob(Long jobId) {
        jobRepository.deleteById(jobId);
    }

    @Override
    public void hideJob(long jobId) {
        Job job = null;
        try {
            job = jobRepository.findById(jobId)
                    .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        } catch (ResourceNotFoundException e) {
            throw new RuntimeException(e);
        }

        // Toggle the isHidden state
        job.setIsHidden(!job.getIsHidden());

        jobRepository.save(job);
    }






    private JobDTO convertToDto(Job job) {
        JobDTO dto = new JobDTO();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setOfferedSalary(job.getOfferedSalary());
        dto.setDescription(job.getDescription());
        dto.setResponsibilities(job.getResponsibilities());
        dto.setRequiredSkills(job.getRequiredSkills());
        dto.setWorkSchedule(job.getWorkSchedule());
        dto.setBenefit(job.getBenefit());
        dto.setPosition(job.getPosition().getValue());
        dto.setJobType(job.getJobType().getValue());
        dto.setContractType(job.getContractType().getValue());


        dto.setExperience(job.getExperience());
        dto.setSlot(job.getSlot());
        dto.setIsHidden(job.getIsHidden());
        dto.setIsSuperHot(job.getIsSuperHot());
        dto.setQualification(job.getQualification());
        dto.setCreatedAt(job.getCreatedAt());
        dto.setExpire(job.getExpire());
        List<Long> categoryId = job.getCategories().stream().map(Category::getCategoryId).collect(Collectors.toList());
        dto.setCategoryId(categoryId);
        dto.setUserId(job.getUser().getId());
        dto.setExpired(job.getExpired());
        dto.setCompanyId(job.getCompany().getCompanyId());
        return dto;
    }


    private Category convertCategoryToEntity(CategoryDTO categoryDTO) {
        Category category = new Category();
        category.setCategoryId(categoryDTO.getCategoryId());
        category.setCategoryName(categoryDTO.getCategoryName());
        // Set other fields if necessary
        return category;
    }
    private Job convertToEntity(JobDTO jobDTO) {
        Job job = new Job();
//        job.setId(jobDTO.getId());

        job.setTitle(jobDTO.getTitle());
        job.setOfferedSalary(jobDTO.getOfferedSalary());
        job.setDescription(jobDTO.getDescription());
        job.setCity(jobDTO.getCity());
        job.setResponsibilities(jobDTO.getResponsibilities());
        job.setRequiredSkills(jobDTO.getRequiredSkills());
        job.setWorkSchedule(jobDTO.getWorkSchedule());
        job.setBenefit(jobDTO.getBenefit());
        job.setSlot(jobDTO.getSlot());
        job.setPosition(Position.fromString(jobDTO.getPosition()));

        job.setJobType(JobType.fromString(jobDTO.getJobType()));

        job.setContractType(ContractType.fromString(jobDTO.getContractType()));

        job.setExperience(jobDTO.getExperience());
        if (jobDTO.getCompanyId() != null) {
            Company company = new Company();
            company.setCompanyId(jobDTO.getCompanyId());
            job.setCompany(company);
        }

        Set<Category> categories =  new HashSet<>();
        if (jobDTO.getCategoryId() != null) {
            for (Long categoryId : jobDTO.getCategoryId()) {
                Category category = new Category();
                category.setCategoryId(categoryId);
                categories.add(category);
            }
        }
        job.setCategories(categories);
        job.setQualification(jobDTO.getQualification());
        if (job.getIsHidden() == null) {
            job.setIsHidden(false); // or true, depending on your requirements
        }
        job.setExpire(jobDTO.getExpire());
        job.setCreatedAt(jobDTO.getCreatedAt());
        LocalDateTime createdAt = jobDTO.getCreatedAt() != null ? jobDTO.getCreatedAt() : LocalDateTime.now();
        job.setExpired(createdAt.plusDays(7));

//        job.setTitle(jobDTO.getTitle());
//        job.setOfferedSalary(jobDTO.getOfferedSalary());
//        job.setDescription(jobDTO.getDescription());
//        job.setCity(jobDTO.getCity());
//        job.setResponsibilities(jobDTO.getResponsibilities());
//        job.setRequiredSkills(jobDTO.getRequiredSkills());
//        job.setWorkSchedule(jobDTO.getWorkSchedule());
//        job.setPosition(Position.INTERN);
//        job.setPosition(Position.FRESHER);
//        job.setPosition(Position.JUNIOR);
//        job.setPosition(Position.SENIOR);
//        job.setPosition(Position.MIDDLE);
//        job.setPosition(Position.MANAGER);
//        job.setJobType(JobType.HYBRID);
//        job.setJobType(JobType.OVERSEA);
//
//        job.setJobType(JobType.IN_OFFICE);
//        job.setJobType(JobType.REMOTE);
//        job.setContractType(ContractType.FREELANCE);
//        job.setContractType(ContractType.FULLTIME);
//        job.setContractType(ContractType.PART_TIME);
//
//
//        job.setSlot(jobDTO.getSlot());
//        job.setExperience(jobDTO.getExperience());
//        job.setQualification(jobDTO.getQualification());
//        job.setCreatedAt(jobDTO.getCreatedAt());
//        job.setExpired(jobDTO.getExpired());
//        job.setExpire(jobDTO.getExpire());
        return job;
    }
//    public Category convertToEntity(CategoryDTO categoryDTO) {
//        return new Category(categoryDTO.getCategoryId(), categoryDTO.getCategoryName());
//    }

}