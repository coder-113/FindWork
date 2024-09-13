import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:file_picker/file_picker.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:jobboardmobile/models/application_model.dart';
import '../constant/endpoint.dart';
import '../dto/application_dto.dart';
import '../service/auth_service.dart';

class JobApplicationService {
  static const String baseUrl = '${Endpoint.baseUrl}';
  final AuthService _authService = AuthService();
  final storage = FlutterSecureStorage();

  Future<int?> getUserId() async {
    String? storedUserId = await storage.read(key: 'userId');
    if (storedUserId != null) {
      return int.parse(storedUserId);
    }
    return null;
  }

  Future<List<ApplicationDTO>> fetchAppliedJobsById() async {
  try {
    int? userId = await getUserId();
    if (userId == null) {
      throw Exception('User ID not found');
    }

    String? accessToken = await _authService.getAccessToken();
    http.Response response = await http.get(
      Uri.parse('$baseUrl/application/user/$userId'),
      headers: {'Authorization': 'Bearer $accessToken'},
    );

    if (response.statusCode == 200) {
      List<dynamic> jsonData = jsonDecode(response.body);
      List<ApplicationDTO> documents = jsonData.map((json) => ApplicationDTO.fromJson(json)).toList();
      return documents;
    } else {
      throw Exception('Failed to fetch documents. Status code: ${response.statusCode}');
    }
  } catch (e) {
    print('Error in fetchAppliedJobsById: $e');
    throw Exception('Failed to fetch documents: $e');
  }
}
  Future<void> applyJob(
    int jobId,
    int companyId,
    int userId,  // Changed from String to int
    String employeeName,
    PlatformFile cvFile,
    String coverLetter,
  ) async {
    String? accessToken = await _authService.getAccessToken();
    var request = http.MultipartRequest(
      'POST',
      Uri.parse('$baseUrl/application/$jobId/$companyId'),
    );

    request.headers['Authorization'] = 'Bearer $accessToken';
    request.fields['userId'] = userId.toString();  // Convert int to String
    request.fields['employeeName'] = employeeName;
    request.fields['coverLetter'] = coverLetter;
    request.files.add(await http.MultipartFile.fromPath('cvFile', cvFile.path!));

    var response = await request.send();

    if (response.statusCode != 200) {
      throw Exception('Failed to submit application');
    }
  }

  Future<bool> hasAppliedForJob(int userId, int jobId) async {
    String? accessToken = await _authService.getAccessToken();
    final response = await http.get(
      Uri.parse('$baseUrl/application/user/$userId/job/$jobId'),
      headers: {'Authorization': 'Bearer $accessToken'},
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to check application status');
    }
  }

  
}