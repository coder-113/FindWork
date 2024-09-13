import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:jobboardmobile/constant/endpoint.dart';
import 'package:jobboardmobile/models/favorite_job_model.dart'; // Ensure this model exists
import 'auth_service.dart'; // Import AuthService

class FavoriteJobService {
  final AuthService _authService = AuthService();
  final String baseUrl = '${Endpoint.baseUrl}/favorite-jobs';

  Future<void> addJobToFavorites(int jobId) async {
    final token = await _authService.getAccessToken();
    if (token == null) {
      throw Exception('User is not authenticated');
    }

    final response = await http.post(
      Uri.parse('$baseUrl/add'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: json.encode({'jobId': jobId}),
    );

    if (response.statusCode != 200) {
      print('Failed to add job to favorites: ${response.body}');
      throw Exception('Failed to add job to favorites');
    }
  }

  Future<List<FavoriteJob>> getFavoriteJobsForUser() async {
    final token = await _authService.getAccessToken();
    if (token == null) {
      throw Exception('User is not authenticated');
    }

    final response = await http.get(
      Uri.parse('$baseUrl/list'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final List<dynamic> jsonResponse = json.decode(response.body);
      print(jsonResponse); // Debugging line

      return jsonResponse.map((job) {
        if (job is Map<String, dynamic>) {
          return FavoriteJob.fromJson(job);
        } else {
          throw Exception('Invalid job data format');
        }
      }).toList();
    } else {
      print('Error response body: ${response.body}');
      throw Exception('Failed to load favorite jobs');
    }
  }

  Future<void> deleteFavoriteJob(int favoriteId) async {
    final token = await _authService.getAccessToken();
    if (token == null) {
      throw Exception('User is not authenticated');
    }

    final response = await http.delete(
      Uri.parse('$baseUrl/delete/$favoriteId'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode != 200) {
      print('Failed to delete favorite job: ${response.body}');
      throw Exception('Failed to delete favorite job');
    }
  }
}
