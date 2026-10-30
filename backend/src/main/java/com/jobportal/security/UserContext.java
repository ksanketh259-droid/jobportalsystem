package com.jobportal.security;

import com.jobportal.model.Role;
import com.jobportal.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class UserContext {

    private static final ThreadLocal<User> CURRENT_USER = new ThreadLocal<>();

    public static void setCurrentUser(User user) {
        CURRENT_USER.set(user);
    }

    public static User getCurrentUser() {
        return CURRENT_USER.get();
    }

    public static User requireUser() {
        User user = CURRENT_USER.get();
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required. Please log in.");
        }
        return user;
    }

    public static User requireRole(Role... allowedRoles) {
        User user = requireUser();
        for (Role r : allowedRoles) {
            if (user.getRole() == r) {
                return user;
            }
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied. Insufficient permissions.");
    }

    public static void clear() {
        CURRENT_USER.remove();
    }
}
