import 'package:flutter/material.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:jobboardmobile/models/favorite_job_model.dart';
import 'package:jobboardmobile/screens/job/ApplyJobForm.dart';
import 'package:jobboardmobile/service/favoriteJob_service.dart';
import 'package:jobboardmobile/service/jobApplication_service.dart';
import '../../core/utils/color_util.dart';
import '../../models/job_model.dart';
import '../../models/company_model.dart';
import '../../constant/endpoint.dart'; // Import your endpoint
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

Future<Map<int, String>> fetchCategories() async {
  try {
    const String baseUrl = '${Endpoint.baseUrl}/categories';
    final response = await http.get(Uri.parse(baseUrl));

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);

      if (data.isNotEmpty &&
          data.every((item) => item is Map<String, dynamic>)) {
        return Map<int, String>.fromEntries(
          data.map((category) {
            final id = category['categoryId'];
            final name = category['categoryName'];

            if (id is int && name is String) {
              return MapEntry(id, name);
            } else {
              throw Exception('Invalid category data format');
            }
          }),
        );
      } else {
        throw Exception('Invalid JSON format');
      }
    } else {
      throw Exception(
          'Failed to load categories, status code: ${response.statusCode}');
    }
  } catch (e) {
    print('Error fetching categories: $e');
    rethrow;
  }
}

class JobDetailsScreen extends StatefulWidget {
  final Job job;
  final Company company;
  final bool isHtml;

  const JobDetailsScreen({
    super.key,
    required this.job,
    required this.company,
    required this.isHtml,
  });

  @override
  _JobDetailsScreenState createState() => _JobDetailsScreenState();
}

class _JobDetailsScreenState extends State<JobDetailsScreen> {
  late Future<Map<int, String>> _categoryFuture;
  bool _isFavorite = false;
  final FavoriteJobService _favoriteJobService = FavoriteJobService();

  final JobApplicationService _appService = JobApplicationService();
  bool _hasApplied = false;
  int? _userId;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _categoryFuture = fetchCategories(); // Initialize category fetching
    _loadFavoriteStatus();
    _initializeUserIdAndCheckStatus();
  }

  Future<void> _initializeUserIdAndCheckStatus() async {
    int? id = await _appService.getUserId();
    if (id != null) {
      _userId = id;
      await _checkApplicationStatus();
    } else {
      print('User ID not found in storage');
    }
    setState(() {
      _isLoading = false;
    });
  }

  Future<void> _checkApplicationStatus() async {
    if (_userId != null) {
      try {
        bool hasApplied =
            await _appService.hasAppliedForJob(_userId!, widget.job.id);
        setState(() {
          _hasApplied = hasApplied;
        });
      } catch (e) {
        print('Failed to check application status: $e');
      }
    }
  }

  Future<void> _refreshStatus() async {
    setState(() {
      _isLoading = true;
    });
    await _checkApplicationStatus();
    setState(() {
      _isLoading = false;
    });
  }

  Future<void> _updateLocalFavoriteStatus(bool status) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('favorite_${widget.job.id}', status);
  }

  Future<bool> _loadLocalFavoriteStatus() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool('favorite_${widget.job.id}') ?? false;
  }

  Future<void> _loadFavoriteStatus() async {
    try {
      final localStatus = await _loadLocalFavoriteStatus();
      setState(() {
        _isFavorite = localStatus;
      });
    } catch (e) {
      print('Error loading favorite status: $e');
    }
  }

  Future<bool> _checkIfFavorite() async {
    try {
      final favoriteJobs = await _favoriteJobService.getFavoriteJobsForUser();
      final isFavorite = favoriteJobs.any((job) => job.jobId == widget.job.id);
      print('isFavorite: $isFavorite');
      return isFavorite;
    } catch (e) {
      print('Error checking favorite status: $e');
      return false;
    }
  }

  Future<void> _toggleFavorite() async {
    try {
      // Fetch the list of favorite jobs for the user
      final favoriteJobs = await _favoriteJobService.getFavoriteJobsForUser();

      // Check if the current job is already in the favorites list
      final favoriteJob = favoriteJobs.firstWhere(
        (job) => job.jobId == widget.job.id,
        orElse: () => FavoriteJob(
          id: 0, // Dummy ID, adjust as needed
          jobId: widget.job.id,
          companyId: 0, // Dummy value, adjust as needed
          companyLogo: '',
          jobTitle: '',
          position: '',
          location: '',
          companyName: '',
          categoryId: [],
          username: '',
          createdAt: '',
          offeredSalary: '',
          jobDescription: '',
          responsibilities: '',
          requiredSkills: '',
          workSchedule: '',
          experience: '',
          qualification: '',
          jobType: '',
          contractType: '',
          benefit: '',
          slot: 0,
          expire: '',
          websiteLink: '',
          companyDescription: '',
          keySkills: '',
          type: '',
          companySize: '',
          country: '',
          countryCode: '',
          workingDays: '',
        ),
      );
      print("favoriteJobId: ${favoriteJob.id}");

      if (favoriteJob.id != 0) {
        // If the job is already a favorite, delete it
        _isFavorite = true;
        print('Deleting favorite job');
        await _favoriteJobService.deleteFavoriteJob(favoriteJob.id);
      } else {
        // If the job is not a favorite, add it
        _isFavorite = false;
        print('Adding job to favorites');
        await _favoriteJobService.addJobToFavorites(widget.job.id);
      }

      // Update the local favorite status
      await _updateLocalFavoriteStatus(!_isFavorite);

      // Update the state to reflect the change
      setState(() {
        _isFavorite = !_isFavorite;
      });
    } catch (e) {
      // Handle errors
      print('Error toggling favorite status: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    String modifiedImageUrl = widget.company.logo
        .replaceAll('http://localhost:8080', Endpoint.imageUrl);

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.job.title),
        backgroundColor: ColorUtil.primaryColor,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Image.network(
                modifiedImageUrl,
                height: 100,
                width: 100,
                fit: BoxFit.cover,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              widget.job.title,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            FutureBuilder<Map<int, String>>(
              future: _categoryFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Text('Error loading categories: ${snapshot.error}');
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return const Text('No categories available');
                } else {
                  final categoryMap = snapshot.data!;
                  return _buildCategoriesRow(categoryMap);
                }
              },
            ),
            const SizedBox(height: 16),
            _buildInfoRow(
                Icons.attach_money, 'Salary', widget.job.offeredSalary),
            _buildInfoRow(
                Icons.description, 'Description', widget.job.description,
                isHtml: true),
            _buildInfoRow(
                Icons.work, 'Responsibilities', widget.job.responsibilities,
                isHtml: true),
            _buildInfoRow(Icons.star, 'Your Skills', widget.job.requiredSkills,
                isHtml: true),
            _buildInfoRow(
                Icons.schedule, 'Work Schedule', widget.job.workSchedule,
                isHtml: true),
            _buildInfoRow(Icons.label, 'Level', widget.job.position),
            _buildInfoRow(Icons.work, 'Experience', widget.job.experience),
            _buildInfoRow(Icons.category, 'Job Type', widget.job.jobType),
            _buildInfoRow(
                Icons.assignment, 'Contract Type', widget.job.contractType),
            _buildInfoRow(Icons.card_giftcard, 'Benefits', widget.job.benefit,
                isHtml: true),
            _buildInfoRow(Icons.calendar_today, 'Expire', widget.job.expire),
            const SizedBox(height: 16),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  FutureBuilder<bool>(
                    future: _checkIfFavorite(),
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return const CircularProgressIndicator();
                      } else if (snapshot.hasError) {
                        return const Text('Error loading favorite status');
                      } else if (snapshot.hasData) {
                        final isFavorite = snapshot.data!;
                        return IconButton(
                          icon: Icon(
                            isFavorite ? Icons.favorite : Icons.favorite_border,
                            color: isFavorite ? Colors.red : Colors.red,
                            size: 30.0,
                          ),
                          onPressed: _toggleFavorite,
                        );
                      } else {
                        return const Text('No data');
                      }
                    },
                  ),
                  ElevatedButton(
                    onPressed: _hasApplied || _userId == null
                        ? null
                        : () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (context) => ApplyJobForm(
                                  job: widget.job,
                                  company: widget.company,
                                  userId: _userId!,
                                  onApplicationSubmitted: () {
                                    setState(() {
                                      _hasApplied = true;
                                    });
                                    _refreshStatus();
                                  },
                                ),
                              ),
                            );
                          },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: ColorUtil.primaryColor,
                      padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    ),
                    child: Text(_hasApplied ? 'Applied' : 'Send Application'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoriesRow(Map<int, String> categoryMap) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            '',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Wrap(
              spacing: 8.0,
              runSpacing: 4.0,
              children: widget.job.categoryId.map((categoryId) {
                final categoryName = categoryMap[categoryId] ?? 'Unknown';
                return Chip(label: Text(categoryName));
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String title, String value,
      {bool isHtml = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 20),
              const SizedBox(width: 8),
              Text(
                title,
                style:
                    const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
            ],
          ),
          const SizedBox(height: 8),
          isHtml
              ? Html(data: value)
              : Text(value, style: const TextStyle(fontSize: 16)),
        ],
      ),
    );
  }
}
