import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:jobboardmobile/constant/endpoint.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

class AuthService {
  // final String baseUrl = 'http://localhost:8080/api/auth';
  final String baseUrl = '${Endpoint.baseUrl}/auth';
  final storage = const FlutterSecureStorage();

  Future<http.Response> login(String username, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/signin'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'username': username, 'password': password}),
    );

    if (response.statusCode == 200) {
      print(response.body);
      var jsonResponse = jsonDecode(response.body);
      await storage.write(key: 'accessToken', value: jsonResponse['token']);
      Map<String, dynamic> decodedToken =
          JwtDecoder.decode(jsonResponse['token']);
      await storage.write(
          key: 'refreshToken', value: jsonResponse['refreshToken']);
      await storage.write(key: 'firstName', value: decodedToken['firstName']);
      await storage.write(key: 'lastName', value: decodedToken['lastName']);
      await storage.write(key: 'email', value: jsonResponse['email']);
      await storage.write(key: 'username', value: jsonResponse['username']);
      await storage.write(key: 'imageUrl', value: decodedToken['imageUrl']);
      await storage.write(key: 'role', value: jsonEncode(decodedToken['role']));
      saveUserId(jsonResponse['id'].toString());
    }

    return response;
  }

  Future<http.Response> loginByGoogle(String? token) async {
    final response = await http.post(
      Uri.parse('$baseUrl/google-mobile'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'token': token}),
    );

    if (response.statusCode == 200) {
      print(response.body);
      var jsonResponse = jsonDecode(response.body);
      await storage.write(key: 'accessToken', value: jsonResponse['token']);
      Map<String, dynamic> decodedToken =
          JwtDecoder.decode(jsonResponse['token']);
      await storage.write(
          key: 'refreshToken', value: jsonResponse['refreshToken']);
      await storage.write(key: 'firstName', value: decodedToken['firstName']);
      await storage.write(key: 'lastName', value: decodedToken['lastName']);
      await storage.write(key: 'email', value: jsonResponse['email']);
      await storage.write(key: 'username', value: jsonResponse['username']);
      await storage.write(key: 'imageUrl', value: decodedToken['imageUrl']);
      await storage.write(key: 'role', value: jsonEncode(decodedToken['role']));
      saveUserId(jsonResponse['id'].toString());
    } else {
      throw Exception('Failed to login');
    }
    return response;
  }

  Future<http.Response> register(String username, String email, String password,
      String firstName, String lastName) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/signupFlutter'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': username,
          'email': email,
          'password': password,
          'firstName': firstName,
          'lastName': lastName,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return response;
      } else if (response.statusCode == 400) {
        // Handle duplicate username or email
        final responseBody = jsonDecode(response.body);
        final errorMessage = responseBody['message'] ?? 'Registration failed';
        throw Exception(errorMessage);
      } else {
        throw Exception('Failed to register: ${response.statusCode}');
      }
    } catch (e) {
      print('Error in register API: $e');
      throw Exception('Failed to register: $e');
    }
  }

  Future<void> forgotPassword(String email) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/forgot-password-flutter?email=$email'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
      );

      if (response.statusCode == 200) {
        print('Password reset email sent successfully.');
      } else if (response.statusCode == 400) {
        print('Invalid token or bad request: ${response.body}');
        throw Exception('Invalid token or bad request');
      } else {
        throw Exception(
            'Failed to send forgot password request: ${response.statusCode}');
      }
    } catch (error) {
      throw Exception('Failed to send forgot password request: $error');
    }
  }

  Future<String> setNewPassword(
      String email, String newPassword, String confirmPassword) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/set-new-passwordFlutter'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(<String, String>{
          'email': email,
          'newPassword': newPassword,
          'confirmPassword': confirmPassword,
        }),
      );

      if (response.statusCode == 200) {
        return "Password reset successfully!";
      } else {
        Map<String, dynamic> jsonResponse = jsonDecode(response.body);
        return jsonResponse['message'];
      }
    } catch (error) {
      print('Error setting new password: $error');
      return "Something went wrong. Please try again later.";
    }
  }

  Future<http.Response> verifyEmail(String email, String code) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/verifyFlutter?email=$email&code=$code'),
        headers: {'Content-Type': 'application/json'},
      );
      return response;
    } catch (e) {
      print('Error verifying email: $e');
      throw Exception('Failed to verify email: $e');
    }
  }

  Future<Map<String, dynamic>> verifyResetPassWord(
      String email, String code) async {
    try {
      final response = await http.post(
        Uri.parse(
            '$baseUrl/verifyResetPassWordFlutter?email=${Uri.encodeComponent(email)}&code=$code'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to verify reset password: ${response.body}');
      }
    } catch (e) {
      print('Error verifying reset password: $e');
      throw Exception('Failed to verify reset password: $e');
    }
  }

  Future<void> logout() async {
    final refreshToken = await storage.read(key: 'refreshToken');
    final response = await http.post(
      Uri.parse('$baseUrl/signout'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'refreshToken': refreshToken}),
    );

    if (response.statusCode == 200) {
      await storage.delete(key: 'accessToken');
      await storage.delete(key: 'refreshToken');
      await storage.delete(key: 'firstName');
      await storage.delete(key: 'lastName');
      await storage.delete(key: 'email');
    } else {
      throw Exception('Failed to logout');
    }
  }

  Future<void> refreshToken(BuildContext context) async {
    final refreshToken = await getRefreshToken();
    if (refreshToken == null) return;

    final response = await http.post(
      Uri.parse('$baseUrl/refreshtoken'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'refreshToken': refreshToken}),
    );

    if (response.statusCode == 200) {
      var jsonResponse = jsonDecode(response.body);
      print("JsonRepsonse: $jsonResponse");
      await storage.write(key: 'accessToken', value: jsonResponse['token']);
      Map<String, dynamic> decodedToken =
          JwtDecoder.decode(jsonResponse['token']);
      await storage.write(
          key: 'refreshToken', value: jsonResponse['refreshToken']);
      await storage.write(key: 'firstName', value: decodedToken['firstName']);
      await storage.write(key: 'lastName', value: decodedToken['lastName']);
      await storage.write(key: 'email', value: jsonResponse['email']);
      await storage.write(key: 'username', value: jsonResponse['username']);
      await storage.write(key: 'imageUrl', value: decodedToken['imageUrl']);
      saveUserId(jsonResponse['id'].toString());
    } else {
      _showSessionExpiredDialog(context);
    }
  }

  void _showSessionExpiredDialog(BuildContext context) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Session Expired'),
          content: const Text('Your session has expired. Please log in again.'),
          actions: <Widget>[
            TextButton(
              child: const Text('OK'),
              onPressed: () {
                Navigator.of(context).pop();
                // Navigate to login screen
              },
            ),
          ],
        );
      },
    );
  }

  Future<http.Response> sendRequestWithRetry(
    BuildContext context,
    Future<http.Response> Function() request,
  ) async {
    http.Response response = await request();
    if (response.statusCode == 401) {
      await refreshToken(context);
      response = await request();
    }
    return response;
  }

  Future<http.Response> getProtectedResource(BuildContext context) async {
    return await AuthService().sendRequestWithRetry(
      context,
      () async {
        final accessToken = await AuthService().getAccessToken();
        return http.get(
          Uri.parse('${Endpoint.baseUrl}/protected-resource'),
          headers: {
            'Authorization': 'Bearer $accessToken',
          },
        );
      },
    );
  }

  Future<String?> getAccessToken() async {
    return await storage.read(key: 'accessToken');
  }

  Future<String?> getRefreshToken() async {
    return await storage.read(key: 'refreshToken');
  }

  Future<String?> getUserId() async {
    return await storage.read(key: 'userId');
  }

  Future<String?> getImageUrl() async {
    return await storage.read(key: 'imageUrl');
  }

  Future<void> saveUserId(String userId) async {
    await storage.write(key: 'userId', value: userId);
  }

  Future<String?> getFirstName() async {
    return await storage.read(key: 'firstName');
  }

  Future<String?> getLastName() async {
    return await storage.read(key: 'lastName');
  }

  Future<String?> getEmail() async {
    return await storage.read(key: 'email');
  }

  Future<String?> getUsername() async {
    return await storage.read(key: 'username');
  }

  Future<void> saveFirstName(String firstName) async {
    await storage.write(key: 'firstName', value: firstName);
  }

  Future<void> saveLastName(String lastName) async {
    await storage.write(key: 'lastName', value: lastName);
  }

  Future<List<String>> getRoles() async {
    String? roleJson = await storage.read(key: 'role');
    if (roleJson != null) {
      print('Role JSON: $roleJson'); // Debugging line

      // Decode the JSON string into a List<dynamic>
      List<dynamic> roleList = jsonDecode(roleJson);

      print(roleList);

      // Extract the 'authority' field from each role and return as List<String>
      return roleList.map((role) {
        if (role is Map<String, dynamic> && role.containsKey('authority')) {
          return role['authority'] as String;
        } else {
          throw Exception('Unexpected role format: $role');
        }
      }).toList();
    } else {
      return [];
    }
  }

  Future<void> saveImageUrl(String imageUrl) async {
    await storage.write(key: 'imageUrl', value: imageUrl);
  }
}
