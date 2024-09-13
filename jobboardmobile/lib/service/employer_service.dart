import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:jobboardmobile/constant/endpoint.dart';
import 'package:http/http.dart' as http;
import 'package:jobboardmobile/models/chart_model.dart';

Future<ChartData> fetchChartData() async {
  final storage = FlutterSecureStorage();
  final accessToken = await storage.read(key: 'accessToken');

  // Decode the JWT token to get the payload
  Map<String, dynamic> payload = JwtDecoder.decode(accessToken!);
  String companyId = payload['company'].toString();
  const String baseUrl = '${Endpoint.baseUrl}';

  final responses = await Future.wait([
    http.get(
      Uri.parse('$baseUrl/job-applications/applicationCount').replace(queryParameters: {'companyId': companyId}),
      headers: {
        'Authorization': 'Bearer $accessToken',
      },
    ),
    http.get(
      Uri.parse('$baseUrl/jobs/count').replace(queryParameters: {'userId': payload['id'].toString()}),
      headers: {
        'Authorization': 'Bearer $accessToken',
      },
    ),
    http.get(
      Uri.parse('$baseUrl/job-applications/newCount').replace(queryParameters: {'companyId': companyId}),
      headers: {
        'Authorization': 'Bearer $accessToken',
      },
    ),
    http.get(
      Uri.parse('$baseUrl/job-applications/approvedCount').replace(queryParameters: {'companyId': companyId}),
      headers: {
        'Authorization': 'Bearer $accessToken',
      },
    ),
    http.get(
      Uri.parse('$baseUrl/job-applications/api/chart-data').replace(queryParameters: {'companyId': companyId}),
      headers: {
        'Authorization': 'Bearer $accessToken',
      },
    ),
  ]);

  if (responses.every((response) => response.statusCode == 200)) {
    final jobCountData = jsonDecode(responses[0].body);
    final cvCountData = jsonDecode(responses[1].body);
    final newCvCountData = jsonDecode(responses[2].body);
    final approvedCvCountData = jsonDecode(responses[3].body);
    final chartData = jsonDecode(responses[4].body);

    final labels = List<String>.from(chartData['labels']);
    final dataset1 = List<int>.from(chartData['dataset1']);

    return ChartData(
      labels: labels,
      dataset1: dataset1,
      jobCountData: [jobCountData], // Chuyển đổi dữ liệu thành List<int>
      cvCountData: [cvCountData], // Chuyển đổi dữ liệu thành List<int>
      newCvCountData: [newCvCountData], // Chuyển đổi dữ liệu thành List<int>
      approvedCvCountData: [approvedCvCountData], // Chuyển đổi dữ liệu thành List<int>
    );
  } else {
    throw Exception('Failed to load chart data');
  }
}
