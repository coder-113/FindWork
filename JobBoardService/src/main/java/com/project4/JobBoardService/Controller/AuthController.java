package com.project4.JobBoardService.Controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.project4.JobBoardService.Config.TokenRefreshException;
import com.project4.JobBoardService.DTO.UserDTO;
import com.project4.JobBoardService.Entity.*;
import com.project4.JobBoardService.Enum.ERole;
import com.project4.JobBoardService.Repository.CompanyRepository;
import com.project4.JobBoardService.Service.UserService;
import com.project4.JobBoardService.payload.*;
import com.project4.JobBoardService.Repository.EmployerRepository;
import com.project4.JobBoardService.Repository.RoleRepository;
import com.project4.JobBoardService.Repository.UserRepository;
import com.project4.JobBoardService.Service.EmailService;
import com.project4.JobBoardService.Service.RefreshTokenService;
import com.project4.JobBoardService.Util.HTMLContentProvider;
import com.project4.JobBoardService.Util.Variables.TokenRequest;
import com.project4.JobBoardService.security.UserDetailsImpl;
import com.project4.JobBoardService.security.jwt.JwtUtils;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000/")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private EmailService emailService;
    @Autowired
    private JavaMailSender javaMailSender;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    private EmployerRepository employerRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    CompanyRepository companyRepository;
    @Autowired
    private UserService userService;
    @Value("${app.googleClientID}")
    private String CLIENT_ID; // Replace with your actual client ID


    @PostMapping("/google")
    public ResponseEntity<?> authenticateUserWithGoogle(@RequestBody TokenRequest tokenRequest) {
        try {
            // Initialize transport and jsonFactory
            JsonFactory jsonFactory = GsonFactory.getDefaultInstance();
            var transport = GoogleNetHttpTransport.newTrustedTransport();

            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                    .setAudience(Collections.singletonList(CLIENT_ID))
                    .build();

            GoogleIdToken idToken = verifier.verify(tokenRequest.getToken());
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();

                // Print user identifier
                String userId = payload.getSubject();
                System.out.println("User ID: " + userId);

                // Get profile information from payload
                String email = payload.getEmail();
                boolean emailVerified = Boolean.valueOf(payload.getEmailVerified());
                String name = (String) payload.get("name");
                String pictureUrl = (String) payload.get("picture");
                String locale = (String) payload.get("locale");
                String familyName = (String) payload.get("family_name");
                String givenName = (String) payload.get("given_name");

                // Use or store profile information
                User user = userRepository.findByEmail(email).orElse(null);

                if (user != null) {
                    if (!user.getIsEnabled()) {
                        return ResponseEntity.badRequest().body(new MessageResponse("Your account is deactivated."));
                    }
                    UserDetailsImpl userDetails = UserDetailsImpl.build(user);
                    Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    String jwt = jwtUtils.generateJwtToken(authentication);

                    List<String> rolesSignIn = userDetails.getAuthorities().stream()
                            .map(GrantedAuthority::getAuthority)
                            .collect(Collectors.toList());
                    RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());

                    return ResponseEntity.ok(new JwtResponse(jwt,
                            refreshToken.getToken(),
                            user.getId(),
                            user.getUsername(),
                            user.getEmail(),
                            user.getFirstName(),
                            user.getLastName(),
                            rolesSignIn,
                            user.getCompany() != null ? user.getCompany().getCompanyId() : null // Check for null company

                    ));


                }

                // Create new user
                user = new User();
                user.setEmail(email);
                user.setUsername(email); // or some other unique identifier
                user.setFirstName(givenName);
                user.setLastName(familyName);
                user.setVerified(emailVerified);
                user.setPassword(encoder.encode("google-password"));
                user.setImageUrl(pictureUrl);
                user.setIsEnabled(true);
                Set<Role> roles = new HashSet<>();
                Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                roles.add(userRole);
                user.setRoles(roles);
                user = userRepository.save(user);

                UserDetailsImpl userDetails = UserDetailsImpl.build(user);
                Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
                String jwt = jwtUtils.generateJwtToken(authentication);

                List<String> rolesSignIn = userDetails.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList());
                RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());

                return ResponseEntity.ok(new JwtResponse(jwt,
                        refreshToken.getToken(),
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getFirstName(),
                        user.getLastName(),
                        rolesSignIn,
                        user.getCompany().getCompanyId()

                ));
            } else {
                System.out.println("Invalid ID token.");
                return ResponseEntity.badRequest().body("Invalid token!");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/google-mobile")
    public ResponseEntity<?> authenticateUserWithGoogleAndroid(@RequestBody TokenRequest tokenRequest) {
        try {
            Map<String, Object> payload = getGoogleUserInfo(tokenRequest.getToken());

            if (payload == null) {
                return ResponseEntity.badRequest().body("Invalid token payload!");
            }

            User user = processUser(payload);
            return createAuthenticationResponse(user);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    private Map<String, Object> getGoogleUserInfo(String token) {
        String url = "https://www.googleapis.com/oauth2/v3/userinfo";
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<String> entity = new HttpEntity<>(headers);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(url, HttpMethod.GET, entity, new ParameterizedTypeReference<Map<String, Object>>() {});

        if (response.getStatusCode() == HttpStatus.OK) {
            return response.getBody();
        } else {
            throw new RuntimeException("Invalid token!");
        }
    }

    private User processUser(Map<String, Object> payload) {
        String email = (String) payload.get("email");
        boolean emailVerified = (Boolean) payload.get("email_verified");
        String givenName = (String) payload.get("given_name");
        String familyName = (String) payload.get("family_name");
        String pictureUrl = (String) payload.get("picture");

        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null) {
            return user;
        }

        user = new User();
        user.setEmail(email);
        user.setUsername(email); // or some other unique identifier
        user.setFirstName(givenName);
        user.setLastName(familyName);
        user.setVerified(emailVerified);
        user.setPassword(encoder.encode("google-password"));
        user.setImageUrl(pictureUrl);
        user.setIsEnabled(true);
        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(userRole);
        user.setRoles(roles);
        return userRepository.save(user);
    }

    private ResponseEntity<?> createAuthenticationResponse(User user) {
        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        List<String> rolesSignIn = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());
        return ResponseEntity.ok(new JwtResponse(jwt,
                refreshToken.getToken(),
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                rolesSignIn,
                user.getCompany() != null ? user.getCompany().getCompanyId() : null // Check for null company
        ));
    }


    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refreshtoken(@Valid @RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    UserDetailsImpl userDetails = UserDetailsImpl.build(user);
                    Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    String jwt = jwtUtils.generateJwtToken(authentication);
                    return ResponseEntity.ok(new TokenRefreshResponse(jwt, requestRefreshToken));
                })
                .orElseThrow(() -> new TokenRefreshException(requestRefreshToken,
                        "Refresh token is not in database!"));
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        } catch (BadCredentialsException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Invalid credentials! Please try again."));
        }

        Optional<User> optionalUser = userRepository.findByUsername(loginRequest.getUsername());
        if (!optionalUser.isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Invalid credentials! Please try again."));
        }

        User user = optionalUser.get();
        // Kiểm tra tài khoản có bị vô hiệu hóa hay không
        if (!user.getIsEnabled()) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Your account is deactivated."));
        }

        // Kiểm tra tài khoản đã được xác minh email chưa, ngoại trừ ROLE_EMPLOYER
        if (!user.isVerified() && !user.getRoles().stream()
                .anyMatch(role -> role.getName().equals(ERole.ROLE_EMPLOYER))) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Please verify your email."));
        }


        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String jwt = jwtUtils.generateJwtToken(authentication);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());
        JwtResponse jwtResponse = new JwtResponse(
                jwt,
                refreshToken.getToken(),
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getFirstName(),
                userDetails.getLastName(),
                roles,
                user.getCompany() != null ? user.getCompany().getCompanyId() : null // Check for null company
        );
        return ResponseEntity.ok(jwtResponse);
    }


    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Email is already in use!"));
        }

        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                signUpRequest.getFirstName(),
                signUpRequest.getLastName(),
                encoder.encode(signUpRequest.getPassword()),
                signUpRequest.getGender());

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();
        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        break;
                    case "mod":
                        Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);
                        break;

                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        user.setIsEnabled(true);
        String verificationCode = generateVerificationCode();
        user.setVerificationCode(verificationCode);
        user.setVerificationCodeExpiry(LocalDateTime.now().plusDays(2));
//        user.setVerificationCodeExpiry(LocalDateTime.now().plusSeconds(30));

        userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), user.getUsername(), user.getFirstName(), verificationCode, user.getEmail());

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/add-moderator")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> registerModerator(@RequestBody RegisterModeratorRequest registerRequest) {
        SignupRequest signUpRequest = registerRequest.getSignupRequest();
        List<String> permissions = registerRequest.getPermissions();

        // Phần còn lại của logic để đăng ký moderator và cập nhật permissions
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                signUpRequest.getFirstName(),
                signUpRequest.getLastName(),
                encoder.encode(signUpRequest.getPassword()),
                signUpRequest.getGender());

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();
        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        }

        user.setRoles(roles);
        user.setIsEnabled(true);
        String verificationCode = generateVerificationCode();
        user.setVerificationCode(verificationCode);

        User userCreated = userRepository.save(user);
        UserDTO userCreatedDto = modelMapper.map(userCreated, UserDTO.class);
        emailService.sendVerificationEmail(user.getEmail(), user.getUsername(), user.getFirstName(), verificationCode, user.getEmail());

        // Cập nhật permissions cho user



        return ResponseEntity.ok(modelMapper.map(userService.updateUserPermissions(userCreated.getId(), permissions), UserDTO.class));
    }

    //Employer
    @PostMapping("/registerEmployer")
    public ResponseEntity<?> registerEmployer(@Valid @RequestBody EmployerSignupRequest signUpRequest) {
        if (employerRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Tạo đối tượng Employer nhưng chưa lưu thông tin công ty
        Employer employer = new Employer();
        employer.setName(signUpRequest.getName());
        employer.setTitle(signUpRequest.getTitle());
        employer.setEmail(signUpRequest.getEmail());
        employer.setPhoneNumber(signUpRequest.getPhoneNumber());
        employer.setCompanyName(signUpRequest.getCompanyName());
        employer.setCompanyAddress(signUpRequest.getCompanyAddress());
        employer.setWebsiteLink(signUpRequest.getCompanyWebsite());
        employer.setVerified(false);
        employer.setApproved(false);

        // Tạo mã xác thực
        String verificationCode = UUID.randomUUID().toString().replace("-", "").substring(0, 6);
        employer.setVerificationCode(verificationCode);

        // Lưu nhà tuyển dụng chưa có công ty
        employerRepository.save(employer);

        return ResponseEntity.ok(new MessageResponse("Employer registered successfully! Please check your email for verification instructions."));
    }


    @PostMapping("/signout")
    public ResponseEntity<?> signOutUser(@RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();
        refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshToken -> {
                    SecurityContextHolder.clearContext();
                    refreshTokenService.deleteRefreshToken(refreshToken);
                    return ResponseEntity.ok().body("User signed out!");
                })
                .orElseThrow(() -> new TokenRefreshException(requestRefreshToken,
                        "Refresh token is not in database!"));

        return null;
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam("email") String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            String resetToken = generateResetToken();
            String resetUrl = "http://localhost:3000/ResetPassword?email=" + email + "&token=" + resetToken;

            user.setResetToken(resetToken);
            userRepository.save(user);

            emailService.sendResetPasswordEmail(user.getEmail(), resetUrl);

            return ResponseEntity.ok(new MessageResponse("Reset password email sent successfully!"));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email not found!"));
        }
    }

    @PostMapping("/verify-reset-token")
    public ResponseEntity<?> verifyResetToken(@RequestParam("email") String email,
                                              @RequestParam("token") String token) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getResetToken() != null && user.getResetToken().equals(token)) {
                return ResponseEntity.ok(new MessageResponse("Token is valid."));
            } else {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid reset token!"));
            }
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email not found!"));
        }
    }

    @PostMapping("/set-new-password")
    public ResponseEntity<?> setNewPassword(@RequestParam("email") String email,
                                            @RequestParam("token") String token,
                                            @RequestParam("newPassword") String newPassword,
                                            @RequestParam("confirmPassword") String confirmPassword) {
        if (!newPassword.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Passwords do not match!"));
        }
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getResetToken() != null && user.getResetToken().equals(token)) {
                user.setPassword(encoder.encode(newPassword));
                user.setResetToken(null);
                userRepository.save(user);
                return ResponseEntity.ok(new MessageResponse("Password reset successfully!"));
            } else {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid reset token!"));
            }
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email not found!"));
        }
    }
//approve


    //VerifyUser
    @RequestMapping(value = "/verify", method = {RequestMethod.GET, RequestMethod.POST})
    public void verifyEmail(
            @RequestParam("email") String email,
            @RequestParam("code") String code,
            @RequestParam("verifyUrl") String verifyUrl,
            HttpServletResponse response
    ) throws IOException {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            String latestVerificationCode = user.getVerificationCode();
            LocalDateTime verificationCodeExpiry = user.getVerificationCodeExpiry();

            if (verificationCodeExpiry != null && LocalDateTime.now().isAfter(verificationCodeExpiry)) {
                userRepository.delete(user);
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Verification code has expired. Please register again.");
                return;
            }

            if (latestVerificationCode != null && latestVerificationCode.equals(code)) {
                user.setVerified(true);
                userRepository.save(user);
                String firstName = user.getFirstName();
                String successMessage = HTMLContentProvider.verifyemailsuccess(firstName, verifyUrl);
                emailService.sendEmailNotification(user.getEmail(), "Email Verified", successMessage);
                response.sendRedirect(verifyUrl + "?message=Email verified successfully!");
            } else {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid verification code!");
            }
        } else {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "User not found!");
        }
    }

    //Verify Employer
    @RequestMapping(value = "/verify-employer", method = {RequestMethod.GET, RequestMethod.POST})
    public void verifyEmployer(@RequestParam("code") String code, HttpServletResponse response) throws IOException {
        Employer employer = employerRepository.findByVerificationCode(code);
        if (employer == null) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Error: Invalid verification code.");
        } else {
            employer.setVerified(true);
            employer.setVerificationCode(null);
            employerRepository.save(employer);

            response.sendRedirect("http://localhost:3000/SetupCredentials?message=Employer verified successfully!");
        }
    }

    //Username password Employer
    @PostMapping("/setup-credentials")
    public ResponseEntity<?> setupCredentials(@Valid @RequestBody PasswordSetupRequest passwordSetupRequest) {
        Employer employer = employerRepository.findByVerificationCode(passwordSetupRequest.getCode());
        if (employer == null) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Invalid verification code."));
        }

        if (!passwordSetupRequest.getPassword().equals(passwordSetupRequest.getConfirmPassword())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Passwords do not match!"));
        }

        if (userRepository.existsByUsername(passwordSetupRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(employer.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = new User();
        user.setUsername(passwordSetupRequest.getUsername());
        user.setEmail(employer.getEmail());
        user.setFirstName(employer.getName());
        user.setLastName(employer.getTitle());
        user.setPassword(encoder.encode(passwordSetupRequest.getPassword()));
        user.setIsEnabled(true);
        user.setCompany(employer.getCompany());  // Set the company reference

        Set<Role> roles = new HashSet<>();
        Role employerRole = roleRepository.findByName(ERole.ROLE_EMPLOYER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(employerRole);
        user.setRoles(roles);


        userRepository.save(user);

        employer.setUser(user);
        employerRepository.save(employer);


        return ResponseEntity.ok(new MessageResponse("Username and password setup successfully! Please check your email to verify your account."));
    }


    @PostMapping("/forgot-password-flutter")
    public ResponseEntity<?> forgotPasswordFlutter(@RequestParam("email") String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            String verificationCode = generateVerificationCode();

            user.setVerificationCode(verificationCode);  // Save the verification code
            userRepository.save(user);

            // Send reset password email
            emailService.sendResetPasswordEmailFlutter(user.getEmail(), user.getUsername(), verificationCode);

            return ResponseEntity.ok(new MessageResponse("Reset password email sent successfully!"));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email not found!"));
        }
    }

    @PostMapping("/set-new-passwordFlutter")
    public ResponseEntity<?> setNewPassword(@RequestBody SetPasswordRequest request) {
        String email = request.getEmail();
        String newPassword = request.getNewPassword();
        String confirmPassword = request.getConfirmPassword();

        if (!newPassword.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Passwords do not match!"));
        }
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setPassword(encoder.encode(newPassword));
            userRepository.save(user);
            return ResponseEntity.ok(new MessageResponse("Password reset successfully!"));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email not found!"));
        }
    }


    @PostMapping("/signupFlutter")
    public ResponseEntity<?> registerUserFlutter(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                signUpRequest.getFirstName(),
                signUpRequest.getLastName(),
                encoder.encode(signUpRequest.getPassword()),
                signUpRequest.getGender());

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();
        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        break;
                    case "mod":
                        Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);
                        break;

                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        user.setIsEnabled(true);
        String verificationCode = generateVerificationCode();
        user.setVerificationCode(verificationCode);

        userRepository.save(user);
        emailService.sendVerificationEmailFlutter(user.getEmail(), user.getUsername(), user.getFirstName(), verificationCode, user.getEmail());

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/verifyFlutter")
    public ResponseEntity<?> verifyEmailFlutter(@RequestParam("email") String email,
                                                @RequestParam("code") String code) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            String latestVerificationCode = user.getVerificationCode();
            if (latestVerificationCode != null && latestVerificationCode.equals(code)) {
                user.setVerified(true);
                userRepository.save(user);
                return ResponseEntity.ok(new MessageResponse("Email verified successfully!"));
            } else {
                return ResponseEntity.badRequest().body(new MessageResponse("Invalid verification code!"));
            }
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("User not found!"));
        }
    }

    @PostMapping("/verifyResetPassWordFlutter")
    public ResponseEntity<?> verifyResetPassWordFlutter(@RequestParam("email") String email,
                                                        @RequestParam("code") String code) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            String latestVerificationCode = user.getVerificationCode();
            if (latestVerificationCode != null && latestVerificationCode.equals(code)) {
                String resetToken = generateResetToken();
                user.setResetToken(resetToken);
                userRepository.save(user);
                return ResponseEntity.ok(new MessageResponse("Email verified successfully! Use the token to reset your password: " + resetToken));
            } else {
                return ResponseEntity.badRequest().body(new MessageResponse("Invalid verification code!"));
            }
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("User not found!"));
        }
    }


    private String generateVerificationCode() {
        return UUID.randomUUID().toString().substring(0, 6);
    }

    private String generateResetToken() {
        return UUID.randomUUID().toString().substring(0, 6);
    }


}
