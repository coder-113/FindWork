import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:jobboardmobile/constant/endpoint.dart';
import 'package:jobboardmobile/service/auth_service.dart';
import '../models/pdf_model.dart';

class PdfDocumentService {

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

  Future<List<PdfDocument>> fetchDocuments() async {
    try {
      int? userId = await getUserId();
      if (userId == null) {
        throw Exception('User ID not found');
      }

      String? accessToken = await _authService.getAccessToken();
      http.Response response = await http.get(
        Uri.parse('$baseUrl/templates/list-document/$userId'),
        headers: {'Authorization': 'Bearer $accessToken'},
      );

      if (response.statusCode == 200) {
        List<dynamic> jsonData = jsonDecode(response.body);
        List<PdfDocument> documents = jsonData.map((json) => PdfDocument.fromJson(json)).toList();
        return documents;
      } else {
        throw Exception('Failed to fetch documents');
      }
    } catch (e) {
      throw Exception('Failed to fetch documents: $e');
    }
  }

  Future<PdfDocument> fetchDocumentById(int documentId) async {
    try {
      String? accessToken = await _authService.getAccessToken();
      http.Response response = await http.get(
        Uri.parse('$baseUrl/templates/document/$documentId'),
        headers: {'Authorization': 'Bearer $accessToken'},
      );

      if (response.statusCode == 200) {
        return PdfDocument.fromJson(jsonDecode(response.body));
      } else {
        throw Exception('Failed to fetch document');
      }
    } catch (e) {
      throw Exception('Failed to fetch document: $e');
    }
  }
}
