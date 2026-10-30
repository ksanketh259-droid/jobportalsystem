package com.jobportal.security;

import com.jobportal.model.User;
import com.jobportal.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Map;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    private final JwtTokenUtil jwtTokenUtil;
    private final UserRepository userRepository;

    public AuthInterceptor(JwtTokenUtil jwtTokenUtil, UserRepository userRepository) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.userRepository = userRepository;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7).trim();
            Map<String, Object> claims = jwtTokenUtil.validateAndExtractClaims(token);
            if (claims != null && claims.get("userId") != null) {
                Long userId = ((Number) claims.get("userId")).longValue();
                User user = userRepository.findById(userId).orElse(null);
                if (user != null) {
                    UserContext.setCurrentUser(user);
                    request.setAttribute("currentUser", user);
                }
            }
        }
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        UserContext.clear();
    }
}
