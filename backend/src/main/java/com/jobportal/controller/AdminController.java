package com.jobportal.controller;

import com.jobportal.dto.DashboardStatsResponse;
import com.jobportal.model.Role;
import com.jobportal.model.User;
import com.jobportal.security.UserContext;
import com.jobportal.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getStats() {
        UserContext.requireRole(Role.ADMIN);
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        UserContext.requireRole(Role.ADMIN);
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        UserContext.requireRole(Role.ADMIN);
        adminService.deleteUser(id);
        Map<String, String> res = new HashMap<>();
        res.put("message", "User deleted successfully");
        return ResponseEntity.ok(res);
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<User> changeUserRole(@PathVariable Long id, @RequestParam Role role) {
        UserContext.requireRole(Role.ADMIN);
        return ResponseEntity.ok(adminService.changeUserRole(id, role));
    }
}
