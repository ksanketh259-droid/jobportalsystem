
package com.jobportal.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class JwtTokenUtil {

    private final String secretKey;
    private final long expirationMs;
    private final ObjectMapper objectMapper;

    public JwtTokenUtil(
            @Value("${jobportal.jwt.secret}") String secretKey,
            @Value("${jobportal.jwt.expiration-ms:86400000}") long expirationMs,
            ObjectMapper objectMapper) {
        this.secretKey = secretKey;
        this.expirationMs = expirationMs;
        this.objectMapper = objectMapper;
    }

    public String generateToken(
            Long userId, String email,
            String role, String fullName) {
        try {
            long now = System.currentTimeMillis();

            Map<String, Object> header = new HashMap<>();
            header.put("alg", "HS256");
            header.put("typ", "JWT");

            Map<String, Object> payload = new HashMap<>();
            payload.put("userId", userId);
            payload.put("email", email);
            payload.put("role", role);
            payload.put("fullName", fullName);
            payload.put("iat", now / 1000);
            payload.put("exp", (now + expirationMs) / 1000);

            String encodedHeader = encode(
                    objectMapper.writeValueAsBytes(header));

            String encodedPayload = encode(
                    objectMapper.writeValueAsBytes(payload));

            String data = encodedHeader + "." + encodedPayload;

            return data + "." + sign(data);

        } catch (Exception e) {
            throw new RuntimeException("JWT generation failed", e);
        }
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> validateAndExtractClaims(String token) {
        try {
            if (token == null) {
                return null;
            }

            String[] parts = token.split("\\.");

            if (parts.length != 3) {
                return null;
            }

            String data = parts[0] + "." + parts[1];
            String expectedSignature = sign(data);

            if (!MessageDigest.isEqual(
                    expectedSignature.getBytes(StandardCharsets.UTF_8),
                    parts[2].getBytes(StandardCharsets.UTF_8))) {
                return null;
            }

            byte[] payload = Base64.getUrlDecoder().decode(parts[1]);

            Map<String, Object> claims =
                    objectMapper.readValue(payload, Map.class);

            Number exp = (Number) claims.get("exp");

            if (exp == null ||
                    exp.longValue() * 1000 <= System.currentTimeMillis()) {
                return null;
            }

            return claims;

        } catch (Exception e) {
            return null;
        }
    }

    private String sign(String data) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");

        SecretKeySpec key = new SecretKeySpec(
                secretKey.getBytes(StandardCharsets.UTF_8),
                "HmacSHA256");

        mac.init(key);

        return encode(mac.doFinal(
                data.getBytes(StandardCharsets.UTF_8)));
    }

    private String encode(byte[] bytes) {
        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
    }
}
