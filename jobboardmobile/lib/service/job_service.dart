import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:jobboardmobile/constant/endpoint.dart';
import 'package:jobboardmobile/models/job_model.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

class JobService {
  final String baseUrl = '${Endpoint.baseUrl}/jobs';

  Future<List<Job>> getAllJobs() async {
    final response = await http.get(Uri.parse(baseUrl));

    if (response.statusCode == 200) {
      final List<dynamic> jsonResponse = json.decode(response.body);
      return jsonResponse.map((job) => Job.fromJson(job)).toList();
    } else {
      throw Exception('Failed to load jobs');
    }
  }

  Future<void> hideJob(int jobId) async {
    const storage = FlutterSecureStorage();
    final accessToken = await storage.read(key: 'accessToken');

    if (accessToken == null) {
      throw Exception('No access token found');
    }

    final response = await http.put(
      Uri.parse('$baseUrl/$jobId/hide'),
      headers: {
        'Authorization': 'Bearer $accessToken',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to hide job');
    }
  }

  Future<List<Job>> getAllJobemployer() async {
    const storage = FlutterSecureStorage();
    final accessToken = await storage.read(key: 'accessToken');

    if (accessToken == null) {
      throw Exception('No access token found');
    }

    // Decode the JWT token to get the payload
    final Map<String, dynamic> payload = JwtDecoder.decode(accessToken);
    final String userId = payload['id'].toString(); // Ensure userId is a string

    // Build URL with userId appended
    final Uri url = Uri.parse('$baseUrl/$userId');

    final response = await http.get(
      url,
      headers: {
        'Authorization': 'Bearer $accessToken',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      print('Response body: ${response.body}'); // Debugging
      final List<dynamic> jsonResponse = json.decode(response.body);
      return jsonResponse.map((job) => Job.fromJson(job)).toList();
    } else {
      throw Exception('Failed to load jobs');
    }
  }
}

  // Additional methods for job service can be added here as needed.

