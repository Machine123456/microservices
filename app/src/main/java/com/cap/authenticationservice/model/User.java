package com.cap.authenticationservice.model;

import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User implements UserDetails {

   public static final Map<String, String> USERNAME_PATTERNS = new HashMap<String, String>() {
      {
         put("^[a-zA-Z0-9]+$", " Username can be only made of letters and numbers");
      }
   };

   public static final Map<String, String> EMAIL_PATTERNS = new HashMap<String, String>() {
      {
         put("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$", "Invalid email format");
      }
   };

   public static final Map<String, String> PASSWORD_PATTERNS = new HashMap<String, String>() {
      {
         put(".{6,}", "Password must have at least 6 characters");
         put(".*[A-Z].*", "Password must have at least one capital letter");
         put(".*[!@#$%^&*].*", "Password must have at least one symbol");
         put(".*\\d.*", "Password must have at least one number");
      }
   };

   @Id
   @GeneratedValue(strategy = GenerationType.AUTO)
   private long id;

   @Column(unique = true, nullable = false)
   private String username;

   @Column(unique = true, nullable = false)
   private String email;

   @Column(nullable = false)
   private String password;

   @ManyToMany(fetch = FetchType.EAGER)
   @JoinTable(name = "user_role", joinColumns = { @JoinColumn(name = "user_id") }, inverseJoinColumns = {
         @JoinColumn(name = "role_id") })
   @Builder.Default
   private Set<Role> roles = new HashSet<>();

   @Override
   public Collection<? extends GrantedAuthority> getAuthorities() {
      Set<GrantedAuthority> authorities = new HashSet<>();
      for (Role role : roles) {
         authorities.add(role);
         role.getAuthorities().stream()
               .forEach(authorities::add);
      }

      return authorities;
   }

   @Override
   public boolean isAccountNonExpired() {
      return true;
   }

   @Override
   public boolean isAccountNonLocked() {
      return true;
   }

   @Override
   public boolean isCredentialsNonExpired() {
      return true;
   }

   @Override
   public boolean isEnabled() {
      return true;
   }

}