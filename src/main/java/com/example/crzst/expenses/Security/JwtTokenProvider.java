package com.example.crzst.expenses.Security;

import com.example.crzst.expenses.model.Role;
import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.Set;

@Component
public class JwtTokenProvider {

    public static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${app.jwtSecret}")
    private String jwtSecret;

    @Value("${app.jwtExpirationInMs}")
    private int jwtExpirationInMs;

    public String generateToken(Authentication authentication) throws UnsupportedEncodingException {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Date now = new Date();
        Date expireDate = new Date(now.getTime() + jwtExpirationInMs);

        Boolean adminStatus = false;
        Set<Role> userRoles = userPrincipal.getRoles();
        Role admin = new Role(1L, "ADMIN");
        if (userRoles.contains(admin)){
            adminStatus = true;
        }


        // Secret requires a getBytes call: https://github.com/auth0/node-jsonwebtoken/issues/208
        return Jwts.builder()
                .setSubject(Long.toString(userPrincipal.getId()))
                .claim("name", userPrincipal.getName())
                .claim("admin", adminStatus)
                .setIssuedAt(new Date())
                .setExpiration(expireDate)
                .signWith(SignatureAlgorithm.HS512, jwtSecret.getBytes("UTF-8"))
                .compact();
    }

    public Long getUserIdFromJWT(String token){
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();

        return Long.parseLong(claims.getSubject());
    }

    public boolean validateToken(String authToken){
        try{
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException ex) {
            logger.error("Invalid JWT signature");
        } catch (MalformedJwtException ex){
            logger.error("Invalid JWT token");
        } catch (ExpiredJwtException ex){
            logger.error("Expired JWT token");
        } catch (UnsupportedJwtException ex){
            logger.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims string is empty");
        }
        return false;
    }
}
