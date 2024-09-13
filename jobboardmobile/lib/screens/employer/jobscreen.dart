import 'package:flutter/material.dart';
import 'package:jobboardmobile/models/job_model.dart';
import 'package:jobboardmobile/service/job_service.dart';

class JobListScreen extends StatefulWidget {
  const JobListScreen({super.key});

  @override
  _JobListScreenState createState() => _JobListScreenState();
}

class _JobListScreenState extends State<JobListScreen> {
  late Future<List<Job>> _futureJobs;

  @override
  void initState() {
    super.initState();
    _futureJobs = JobService().getAllJobemployer();
  }

  Future<void> _hideJob(BuildContext context, int jobId) async {
    try {
      await JobService().hideJob(jobId);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Job hidden successfully')),
      );
      setState(() {
        _futureJobs = JobService().getAllJobemployer(); // Reload the job list
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to hide job: $e')),
      );
    }
  }

  Future<void> _showJob(BuildContext context, int jobId) async {
    try {
      await JobService().hideJob(jobId); // Ensure showJob method is implemented
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Job shown successfully')),
      );
      setState(() {
        _futureJobs = JobService().getAllJobemployer(); // Reload the job list
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to show job: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Job List'),
        backgroundColor: Color.fromARGB(255, 50, 201, 70),
      ),
      body: FutureBuilder<List<Job>>(
        future: _futureJobs,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(child: Text('No jobs available'));
          }

          final jobs = snapshot.data!;

          return ListView.builder(
            itemCount: jobs.length,
            itemBuilder: (context, index) {
              final job = jobs[index];

              return ListTile(
                title: Text(job.title ?? 'No title'),
                subtitle: Text(job.offeredSalary?.toString() ?? 'No salary'),
                trailing: IconButton(
                  icon: Icon(
                    job.isHidden ? Icons.visibility : Icons.visibility_off,
                    color: job.isHidden ? Colors.grey : null, // Đổi màu nếu bị ẩn
                  ),
                  onPressed: () {
                    if (job.isHidden) {
                      _showJob(context, job.id);
                    } else {
                      _hideJob(context, job.id);
                    }
                  },
                ),
                onTap: () {
                  Navigator.pushNamed(
                    context,
                    '/jobemployer',
                    arguments: job,
                  );
                },
              );
            },
          );
        },
      ),
    );
  }
}
