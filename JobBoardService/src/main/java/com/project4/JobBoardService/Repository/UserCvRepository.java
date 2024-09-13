package com.project4.JobBoardService.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Entity.UserCV;
import org.springframework.transaction.annotation.Transactional;


public interface UserCvRepository extends JpaRepository<UserCV, Long> {
	UserCV findByUser(User user);
	 
	 @Query("SELECT u FROM UserCV u WHERE u.user.id = :userId AND u.template.id = :templateId")
	    Optional<UserCV> findByUserIdAndTemplateId(@Param("userId") Long userId, @Param("templateId") Long templateId);
//	 @EntityGraph(attributePaths = {"userDetails", "userEducations", "userExperiences", "userSkills", "userProjects", "userLanguages"})
	    UserCV findByUserId(Long userId);

//	@Query("SELECT DISTINCT u.user.id FROM UserCV u")
//	List<Long> findAllUserIds();
@Transactional
@Modifying
@Query("DELETE FROM UserDetail d WHERE d.userCV.user.id = :userId")
void deleteUserDetailsByUserId(@Param("userId") Long userId);

	@Transactional
	@Modifying
	@Query("DELETE FROM UserEducation e WHERE e.userCV.user.id = :userId")
	void deleteUserEducationsByUserId(@Param("userId") Long userId);

	@Transactional
	@Modifying
	@Query("DELETE FROM UserExperience ex WHERE ex.userCV.user.id = :userId")
	void deleteUserExperiencesByUserId(@Param("userId") Long userId);

	@Transactional
	@Modifying
	@Query("DELETE FROM UserSkill s WHERE s.userCV.user.id = :userId")
	void deleteUserSkillsByUserId(@Param("userId") Long userId);

	@Transactional
	@Modifying
	@Query("DELETE FROM UserProject p WHERE p.userCV.user.id = :userId")
	void deleteUserProjectsByUserId(@Param("userId") Long userId);

	@Transactional
	@Modifying
	@Query("DELETE FROM UserLanguage l WHERE l.userCV.user.id = :userId")
	void deleteUserLanguagesByUserId(@Param("userId") Long userId);

	@Transactional
	@Modifying
	@Query("DELETE FROM UserCV cv WHERE cv.user.id = :userId")
	void deleteByUserId(@Param("userId") Long userId);

	List<UserCV> findAllByUserId(Long userId);
	Optional<UserCV> findByCvIdAndUser(Long cvId, User user);
	UserCV findByCvIdAndUserId(Long cvId, Long userId);


}
