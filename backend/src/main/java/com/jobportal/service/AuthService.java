package com.jobportal.service;

import com.jobportal.dto.AuthRequest;
import com.jobportal.dto.AuthResponse;
import com.jobportal.dto.ProfileUpdateRequest;
import com.jobportal.dto.RegisterRequest;
import com.jobportal.model.Role;
import com.jobportal.model.User;
import com.jobportal.repository.UserRepository;
import com.jobportal.security.JwtTokenUtil;
import com.jobportal.security.PasswordUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;

    public AuthService(UserRepository userRepository, JwtTokenUtil jwtTokenUtil) {
        this.userRepository = userRepository;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(PasswordUtil.hashPassword(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        user.setRole(request.getRole() != null ? request.getRole() : Role.JOB_SEEKER);
        user.setPhone(request.getPhone());
        user.setTitle(request.getTitle());
        user.setCompanyName(request.getCompanyName());
        user.setCompanyWebsite(request.getCompanyWebsite());

        User savedUser = userRepository.save(user);
        String token = jwtTokenUtil.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getRole().name(), savedUser.getFullName());

        return new AuthResponse(token, savedUser);
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!PasswordUtil.verifyPassword(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        String token = jwtTokenUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name(), user.getFullName());
        return new AuthResponse(token, user);
    }

    @Transactional
    public User updateProfile(User currentUser, ProfileUpdateRequest req) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (req.getFullName() != null && !req.getFullName().isBlank()) {
            user.setFullName(req.getFullName().trim());
        }
        if (req.getPhone() != null) user.setPhone(req.getPhone());
        if (req.getTitle() != null) user.setTitle(req.getTitle());
        if (req.getBio() != null) user.setBio(req.getBio());
        if (req.getSkills() != null) user.setSkills(req.getSkills());
        if (req.getExperienceYears() != null) user.setExperienceYears(req.getExperienceYears());
        if (req.getEducation() != null) user.setEducation(req.getEducation());
        if (req.getResumeFileName() != null) user.setResumeFileName(req.getResumeFileName());
        if (req.getCompanyName() != null) user.setCompanyName(req.getCompanyName());
        if (req.getCompanyWebsite() != null) user.setCompanyWebsite(req.getCompanyWebsite());
        if (req.getCompanyDescription() != null) user.setCompanyDescription(req.getCompanyDescription());

        return userRepository.save(user);
    }
}
