import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart';
import 'package:jobboardmobile/constant/endpoint.dart';

class UserService {
  final String baseUrl = '${Endpoint.baseUrl}/users';
  final storage = const FlutterSecureStorage();

  Future<String?> getUsername() async {
    return await storage.read(key: 'username');
  }

  Future<http.Response> updateUser(BuildContext context, int id,
      Map<String, dynamic> userInfo, MultipartFile? imageFile) async {
    var uri = Uri.parse('$baseUrl/$id');
    var request = http.MultipartRequest('PUT', uri);

    // Add user info to the request
    userInfo.forEach((key, value) {
      request.fields[key] = value.toString();
    });

    // Add image file if provided
    if (imageFile != null) {
      request.files.add(imageFile);
    }

    // Add authorization header
    String? token = await storage.read(key: 'accessToken');
    request.headers['Authorization'] = 'Bearer $token';

    try {
      var streamedResponse = await request.send();
      var response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 200) {
        return response;
      } else if (response.statusCode == 401) {
        // Handle token refresh here if needed
        // Then retry the request
      }
      throw Exception('Failed to update user');
    } catch (e) {
      throw Exception('Error updating user: $e');
    }
  }

  Future<Map<String, dynamic>> getUserByUsername(String username) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/$username'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Failed to load user data');
      }
    } catch (e) {
      throw Exception('Error loading user data: $e');
    }
  }

  Future<void> saveFirstName(String firstName) async {
    await storage.write(key: 'firstName', value: firstName);
  }

  Future<void> saveLastName(String lastName) async {
    await storage.write(key: 'lastName', value: lastName);
  }

  Future<void> saveImageUrl(String imageUrl) async {
    await storage.write(key: 'imageUrl', value: imageUrl);
  }
}
