package com.project4.JobBoardService.Config.Aspect;

import com.project4.JobBoardService.Config.Annotation.CheckPermission;
import com.project4.JobBoardService.Config.PermissionDeniedException;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Enum.EPermissions;
import com.project4.JobBoardService.Enum.ERole;
import com.project4.JobBoardService.Repository.UserRepository;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class PermissionAspect {

    @Autowired
    private UserRepository userRepository;

    @Around("@annotation(checkPermission)")
    public Object checkPermission(ProceedingJoinPoint joinPoint, CheckPermission checkPermission) throws Throwable {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdmin = user.getRoles().stream().anyMatch(role -> role.getName().equals(ERole.ROLE_ADMIN));
        if (isAdmin) {
            // If user is an admin, allow the operation
            return joinPoint.proceed();
        }

        boolean isModerator = user.getRoles().stream().anyMatch(role -> role.getName().equals(ERole.ROLE_MODERATOR));
        if (!isModerator) {
            throw new PermissionDeniedException();
        }

        EPermissions requiredPermission = checkPermission.value();
        boolean hasPermission = user.getPermissions().stream().anyMatch(p -> p.getName().equals(requiredPermission.name()));

        if (!hasPermission) {
            throw new PermissionDeniedException();
        }

        return joinPoint.proceed();
    }
}
