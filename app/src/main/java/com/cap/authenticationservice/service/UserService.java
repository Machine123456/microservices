package com.cap.authenticationservice.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.cap.authenticationservice.dto.AuthorityRequest;
import com.cap.authenticationservice.dto.AuthorityResponse;
import com.cap.authenticationservice.dto.RoleRequest;
import com.cap.authenticationservice.dto.RoleResponse;
import com.cap.authenticationservice.dto.UserRequest;
import com.cap.authenticationservice.dto.UserResponse;
import com.cap.authenticationservice.model.Authority;
import com.cap.authenticationservice.model.Role;
import com.cap.authenticationservice.model.User;
import com.cap.authenticationservice.repository.AuthorityRepository;
import com.cap.authenticationservice.repository.RoleRepository;
import com.cap.authenticationservice.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AuthorityRepository authorityRepository;

    private final PasswordEncoder passwordEncoder;

    /* Get all */

    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserResponse> responses = users.stream().map(this::mapToUserResponse).collect(Collectors.toList());
        return responses;
    }

    public List<RoleResponse> getAllRoles() {
        List<Role> roles = roleRepository.findAll();
        List<RoleResponse> responses = roles.stream().map(this::mapToRoleResponse).collect(Collectors.toList());
        return responses;
    }

    public List<AuthorityResponse> getAllAuthorities() {
        List<Authority> authorities = authorityRepository.findAll();
        List<AuthorityResponse> responses = authorities.stream().map(this::mapToAuthorityResponse)
                .collect(Collectors.toList());
        return responses;
    }

    /* Find By */
    public UserResponse findUserByUsername(String uname) throws IllegalArgumentException {
        var user = userRepository.findByUsername(uname)
                .orElseThrow(() -> new IllegalArgumentException("User not found with username: " + uname));
        return mapToUserResponse(user);
    }

    public UserResponse findUserById(Long userId) throws IllegalArgumentException {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return mapToUserResponse(user);
    }

    /* Create */

    public void createUser(UserRequest userRequest) throws IllegalArgumentException {

        var user = mapToUser(userRequest);

        if (userRepository.findFirstByEmailOrUsername(user.getEmail(), user.getUsername()).isPresent())
            throw new IllegalArgumentException("User with the same email or username already exists.");

        userRepository.save(user);
    }

    public void createRole(RoleRequest roleRequest) throws IllegalArgumentException {
        var role = mapToRole(roleRequest);
        roleRepository.save(role);
    }

    public void createAuthority(AuthorityRequest authorityRequest) throws IllegalArgumentException {
        var authority = mapToAuthority(authorityRequest);
        authorityRepository.save(authority);
    }

    /* Delete */

    public void deleteUser(long id) throws IllegalArgumentException {
        userRepository.deleteById(id);
    }

    public void deleteRole(long id) throws IllegalArgumentException {
        roleRepository.deleteById(id);
    }

    public void deleteAuthority(long id) throws IllegalArgumentException {
        authorityRepository.deleteById(id);
    }

    /* Update */

    public void updateUserRoles(long id, String... rolesStr) throws IllegalArgumentException {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        var userRoles = fetchRolesStrings(rolesStr);

        user.setRoles(userRoles);

        userRepository.save(user);
    }

    public void updateUser(long id, UserRequest userRequest) throws IllegalArgumentException {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        User userData = mapToUser(userRequest);

        user.setUsername(userData.getUsername());
        user.setEmail(userData.getEmail());
        user.setPassword(userData.getPassword());

        userRepository.save(user);
    }

    public void updateRoleAuthorities(long id, String... authoritiesStr) throws IllegalArgumentException {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Role not found with id: " + id));

        var roleAuthorities = fetchAuthoritiesStrings(authoritiesStr);

        role.setAuthorities(roleAuthorities);

        roleRepository.save(role);
    }

    public void updateRole(long id, RoleRequest roleRequest) throws IllegalArgumentException {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Role not found with id: " + id));

        Role roleData = mapToRole(roleRequest);

        role.setName(roleData.getName());

        roleRepository.save(role);
    }

    public void updateAuthority(long id, AuthorityRequest authorityRequest) throws IllegalArgumentException {
        Authority authority = authorityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Authority not found with id: " + id));

        Authority authorityData = mapToAuthority(authorityRequest);

        authority.setAuthority(authorityData.getAuthority());

        authorityRepository.save(authority);
    }

    /* User Requirements */

    public Map<String, Map<String, String>> getUserFieldsRequirements() {
        return new HashMap<String, Map<String, String>>() {
            {
                put("username", User.USERNAME_PATTERNS);
                put("email", User.EMAIL_PATTERNS);
                put("password", User.PASSWORD_PATTERNS);
            }
        };
    }

    private void validateFields(String username, String email, String password) {
        List<String> errorMessages = new ArrayList<>();

        errorMessages.addAll(validateFieldWithPattern(username, User.USERNAME_PATTERNS));
        errorMessages.addAll(validateFieldWithPattern(email, User.EMAIL_PATTERNS));
        errorMessages.addAll(validateFieldWithPattern(password, User.PASSWORD_PATTERNS));

        if (!errorMessages.isEmpty()) {
            throw new IllegalArgumentException("Invalid field(s):\n- " + String.join("\n- ", errorMessages));
        }
    }

    private List<String> validateFieldWithPattern(String field, Map<String, String> patterns) {

        List<String> errorMessages = new ArrayList<>();

        for (Map.Entry<String, String> entry : patterns.entrySet()) {
            String pattern = entry.getKey();
            String errorMessage = entry.getValue();

            if (!field.matches(pattern)) {
                errorMessages.add(errorMessage);
            }
        }

        return errorMessages;
    }

    /* Map request to model */

    public User mapToUser(UserRequest userRequest) {
        return mapToUser(userRequest, "ROLE_USER");
    }

    public User mapToUser(UserRequest userRequest, String... rolesStr) {

        validateFields(userRequest.getUsername(), userRequest.getEmail(), userRequest.getPassword());

        Set<Role> userRoles = fetchRolesStrings(rolesStr);

        User user = User.builder()
                .username(userRequest.getUsername())
                .email(userRequest.getEmail())
                .password(passwordEncoder.encode(userRequest.getPassword()))
                .roles(userRoles)
                .build();

        return user;
    }

    public Set<Role> fetchRolesStrings(String... rolesStr) {
        Set<Role> userRoles = new HashSet<>();

        for (String roleString : rolesStr) {
            Role role = roleRepository.findByName(roleString)
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Could not find \"" + roleString + "\" in the roles repository"));
            userRoles.add(role);
        }

        return userRoles;
    }

    public Role mapToRole(RoleRequest roleRequest, String... authoritiesStr) {

        Set<Authority> roleAuthorities = fetchAuthoritiesStrings(authoritiesStr);

        Role role = Role.builder()
                .name(roleRequest.getName())
                .authorities(roleAuthorities)
                .build();

        return role;
    }

    public Set<Authority> fetchAuthoritiesStrings(String... authoritiesStr) {
        Set<Authority> roleAuthorities = new HashSet<>();

        for (String authorityString : authoritiesStr) {
            Authority authority = authorityRepository.findByAuthority(authorityString)
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Could not find \"" + authorityString + "\" in the authority repository"));

            roleAuthorities.add(authority);
        }

        return roleAuthorities;
    }

    public Authority mapToAuthority(AuthorityRequest authorityRequest) {

        Authority authority = Authority.builder()
                .authority(authorityRequest.getAuthority())
                .build();
        return authority;
    }

    /* Map model to response */

    public UserResponse mapToUserResponse(User user) {

        RoleResponse[] roles = user.getRoles().stream().map(this::mapToRoleResponse)
                .toArray(RoleResponse[]::new);
        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(roles)
                .build();
        return userResponse;
    }

    public RoleResponse mapToRoleResponse(Role role) {
        AuthorityResponse[] authorities = role.getAuthorities().stream().map(this::mapToAuthorityResponse)
                .toArray(AuthorityResponse[]::new);
        return new RoleResponse(role.getId(), role.getName(), authorities);
    }

    public AuthorityResponse mapToAuthorityResponse(Authority authority) {
        return new AuthorityResponse(authority.getId(), authority.getAuthority());
    }

}
