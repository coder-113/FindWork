import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:jobboardmobile/constant/endpoint.dart';
import 'package:jobboardmobile/screens/job/JobListScreen.dart';
import 'package:jobboardmobile/service/quiz_service.dart';
import 'package:kommunicate_flutter/kommunicate_flutter.dart';

import '../../core/utils/color_util.dart';
import '../../models/company_model.dart';
import '../../models/job_model.dart';
import '../../service/auth_service.dart';
import '../../service/company_service.dart';
import '../../service/jobApplication_service.dart';
import '../../service/job_service.dart';
import '../../widget/box_icon.dart';
import '../../widget/custom_app_bar.dart';
import '../../core/utils/asset_path_list.dart' as assetPath;
import '../../widget/search_icon.dart';
import '../company/CompanyDetailsScreen.dart';
import '../company/CompanyListScreen.dart';
import '../job/ApplyJobsScreen.dart';
import '../job/JobDetailsScreen.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  final AuthService _authService = AuthService();
  final CompanyService _companyService = CompanyService();
  final JobService _jobService = JobService();

  final storage = const FlutterSecureStorage();
  String? firstName;
  String? lastName;
  String? email;
  String? role;
  String? imageUrl;
  List<Company> _companies = [];
  List<Job> _jobs = [];
  Map<int, Company> _companyMap = <int, Company>{};
  List<String> authorities = [];

  @override
  void initState() {
    super.initState();

    _fetchUserDetails();
    _fetchCompaniesAndJobs();
  }

  void _fetchUserDetails() async {
    firstName = await _authService.getFirstName();
    lastName = await _authService.getLastName();
    email = await _authService.getEmail();
    imageUrl = await _authService.getImageUrl();
    authorities = await _authService.getRoles();

    try {
      print('Authorities: $authorities');
    } catch (e) {
      print('Error fetching user details or roles: $e');
    }

    print('First Name: $firstName');
    print('Last Name: $lastName');
    print('Email: $email');
    print('Image URL: $imageUrl');
    print('Role: $role');

    setState(() {});
  }

  void _fetchCompaniesAndJobs() async {
    try {
      final companies = await _companyService.getAllCompanies();
      final jobs = await _jobService.getAllJobs();

      setState(() {
        _companies = companies;
        _jobs = jobs;
        _companyMap = {
          for (var company in companies) company.companyId: company
        };
      });
    } catch (e) {}
  }

  void _navigateToProfile() async {
    final result = await Navigator.pushNamed(context, '/myprofile');
    if (result == true) {
      // Profile was updated, refresh user details
      _fetchUserDetails();
      setState(() {}); // Trigger a rebuild of the UI
    }
  }

  void _logout() async {
    await _authService.logout();
    Navigator.pushReplacementNamed(context, '/login');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: ColorUtil.primaryColor,
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () => Navigator.of(context).pushNamed('/search'),
          ),
        ],
      ),
      drawer: _buildDrawer(),
      body: Container(
        margin: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildTags(),
            const SizedBox(height: 15),
            _buildForYouSection(),
            const SizedBox(height: 15),
            _buildRecentlyAddedSection(),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          dynamic conversationObject = {
            'appId':
                '12b89b2bd944255d48649585ef9106922', // Replace with your Kommunicate App ID
          };

          KommunicateFlutterPlugin.buildConversation(conversationObject)
              .then((clientConversationId) {
            print("Conversation builder success : $clientConversationId");
          }).catchError((error) {
            print("Conversation builder error : $error");
          });
        },
        tooltip: 'Action',
        child: const Icon(Icons.message),
      ),
    );
  }

  Widget _buildDrawer() {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          UserAccountsDrawerHeader(
            accountName: Text('${firstName ?? ''} ${lastName ?? ''}'),
            accountEmail: Text(email ?? ''),
            currentAccountPicture: imageUrl != null
                ? ClipOval(
                    child: Image.network(
                      imageUrl!.replaceFirst(
                          'http://localhost:8080', Endpoint.imageUrl),
                      fit: BoxFit.cover,
                      width: 40,
                      height: 40,
                    ),
                  )
                : const Icon(
                    Icons.face,
                    size: 48.0,
                    color: Colors.white,
                  ),
            otherAccountsPictures: [
              const Icon(
                Icons.bookmark_border,
                color: Colors.white,
              ),
              GestureDetector(
                onTap: () {
                  Navigator.pushNamed(context, '/applied_jobs');
                },
                child: const Icon(
                  Icons.assignment_turned_in,
                  color: Colors.white,
                ),
              ),
            ],
            decoration: BoxDecoration(
              color: ColorUtil.primaryColor,
            ),
          ),
          _buildDrawerItem(Icons.note_add, 'My Profile', _navigateToProfile),
          _buildDrawerItem(Icons.business, 'Companies', () {
            Navigator.push(
              context,
              MaterialPageRoute(
                  builder: (context) => const CompanyListScreen()),
            );
          }),
          _buildDrawerItem(Icons.business, 'Jobs', () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => JobListScreen(
                  jobs: _jobs, // Pass the actual list of jobs
                  companies: _companies, // Pass the actual list of companies
                ),
              ),
            );
          }),
          if (authorities.any((item) => item == 'ROLE_EMPLOYER')) ...[
            _buildDrawerItem(Icons.visibility, 'Employer Dashboard', () {
              Navigator.pushNamed(context, '/chart');
            }),
            _buildDrawerItem(Icons.work, 'Employer Job', () {
              Navigator.pushNamed(context, '/joblist');
            }),
            const Divider(),
          ],
          _buildDrawerItem(Icons.note_add, 'Saved jobs', () {
            Navigator.pushNamed(context, '/save_jobs');
          }),
          _buildDrawerItem(Icons.note_add, 'Blog', () {
            Navigator.pushNamed(context, '/blog');
          }),
          _buildDrawerItem(Icons.notifications, 'Notifications', () {
            Navigator.pushNamed(context, '/notifications');
          }),
          _buildDrawerItem(Icons.note_add, 'Quiz', () {
            Navigator.pushNamed(context, '/quizzes');
          }),
          _buildDrawerItem(Icons.document_scanner, 'Cv-management', () {
            Navigator.pushNamed(context, '/document_list');
          }),
          const Divider(),
          _buildDrawerItem(Icons.settings, 'Settings', () {
            Navigator.pop(context);
          }),
          _buildDrawerItem(Icons.logout, 'Logout', _logout),
        ],
      ),
    );
  }

  Widget _buildDrawerItem(IconData icon, String title, VoidCallback onTap) {
    return ListTile(
      leading: Icon(icon),
      title: Text(title),
      onTap: onTap,
    );
  }

  Widget _buildTags() {
    return Row(
      children: [
        _buildTagButton("New York"),
        const SizedBox(width: 15),
        _buildTagButton("Full Time"),
      ],
    );
  }

  Widget _buildTagButton(String title) {
    return TextButton(
      style: TextButton.styleFrom(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
      ),
      onPressed: () {},
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 10),
        child: Row(
          children: [
            Text(
              title,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w900,
                color: ColorUtil.primaryColor,
              ),
            ),
            const SizedBox(width: 5),
            Icon(
              Icons.close,
              color: ColorUtil.primaryColor,
              size: 15,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildForYouSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Company For You",
          style: TextStyle(
            fontWeight: FontWeight.w900,
            fontSize: 16,
          ),
        ),
        const SizedBox(height: 5),
        SizedBox(
          height: 230,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: _companies.length,
            itemBuilder: (context, index) {
              final company = _companies[index];
              return ForYouCard(company: company);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildRecentlyAddedSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Recently Added",
          style: TextStyle(
            fontWeight: FontWeight.w900,
            fontSize: 16,
          ),
        ),
        const SizedBox(height: 5),
        SizedBox(
          height: 230,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: _jobs.length,
            itemBuilder: (context, index) {
              final job = _jobs[index];
              final company = _companyMap[job.companyId];
              if (company != null) {
                return RecentlyAddedCard(job: job, company: company);
              } else {
                return Container(); // or some placeholder widget
              }
            },
          ),
        ),
      ],
    );
  }
}

class ForYouCard extends StatelessWidget {
  final Company company;

  const ForYouCard({super.key, required this.company});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => CompanyDetailsScreen(company: company),
          ),
        );
      },
      child: Container(
        width: 150,
        margin: const EdgeInsets.only(right: 15),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10),
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.3),
              blurRadius: 5,
              spreadRadius: 2,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(10),
                topRight: Radius.circular(10),
              ),
              child: Image.network(
                company.logo.replaceFirst(
                  'http://localhost:8080',
                  Endpoint.imageUrl,
                ),
                fit: BoxFit.cover,
                height: 100,
                width: double.infinity,
              ),
            ),
            const SizedBox(height: 5),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: Text(
                company.companyName,
                style: const TextStyle(
                  fontWeight: FontWeight.w900,
                  fontSize: 12,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            const SizedBox(height: 5),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: Text(
                company.location,
                style: const TextStyle(
                  fontSize: 10,
                  color: Colors.grey,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class RecentlyAddedCard extends StatelessWidget {
  final Job job;
  final Company company;

  const RecentlyAddedCard({
    super.key,
    required this.job,
    required this.company,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) =>
                JobDetailsScreen(job: job, company: company, isHtml: false),
          ),
        );
      },
      child: Container(
        width: 150,
        margin: const EdgeInsets.only(right: 15),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10),
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.3),
              blurRadius: 5,
              spreadRadius: 2,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(10),
                topRight: Radius.circular(10),
              ),
              child: Image.network(
                company.logo.replaceFirst(
                  'http://localhost:8080',
                  Endpoint.imageUrl,
                ),
                fit: BoxFit.cover,
                height: 100,
                width: double.infinity,
              ),
            ),
            const SizedBox(height: 5),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: Text(
                job.title,
                style: const TextStyle(
                  fontWeight: FontWeight.w900,
                  fontSize: 12,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            const SizedBox(height: 5),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: Text(
                job.offeredSalary,
                style: const TextStyle(
                  fontSize: 10,
                  color: Colors.grey,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
