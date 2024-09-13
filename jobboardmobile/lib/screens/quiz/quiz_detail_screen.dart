import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:jobboardmobile/screens/quiz/questions_screen.dart';
import '../../constant/endpoint.dart';
import '../../models/quiz_model.dart';
import '../../service/quiz_service.dart';
import 'dart:async';

class QuizDetailScreen extends StatefulWidget {
  final Quiz quiz;
  final int userId;

  QuizDetailScreen({
    required this.quiz,
    required this.userId,
  });

  @override
  _QuizDetailScreenState createState() => _QuizDetailScreenState();
}

class _QuizDetailScreenState extends State<QuizDetailScreen> {
  late Future<AttemptsInfo?> _attemptsInfoFuture;
  late Future<List<int>> _completedQuizzesFuture;

  @override
  void initState() {
    super.initState();
    _attemptsInfoFuture = _fetchAttemptsInfo();
    _completedQuizzesFuture = _fetchCompletedQuizzes();
  }

  Future<AttemptsInfo?> _fetchAttemptsInfo() async {
    try {
      final attemptsData =
          await QuizService().getAttemptsInfo(widget.quiz.id, widget.userId);
      return AttemptsInfo.fromJson(attemptsData);
    } catch (e) {
      print('Error fetching attempts info: $e');
      return null;
    }
  }

  Future<List<int>> _fetchCompletedQuizzes() async {
    try {
      final completedQuizzes =
          await QuizService().getCompletedQuizzes(widget.userId);
      return completedQuizzes;
    } catch (e) {
      print('Error fetching completed quizzes: $e');
      return [];
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Chi tiết Quiz',
          textAlign: TextAlign.center, // Căn giữa tiêu đề
          style: TextStyle(
            color: Colors.black, // Màu chữ tiêu đề
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.white, // Màu nền của AppBar
        elevation: 0, // Loại bỏ bóng dưới AppBar
        centerTitle: true, // Căn giữa tiêu đề
      ),
      body: FutureBuilder<AttemptsInfo?>(
        future: _attemptsInfoFuture,
        builder: (context, attemptsSnapshot) {
          if (attemptsSnapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (attemptsSnapshot.hasError) {
            return Center(child: Text('Error loading attempts info'));
          } else if (!attemptsSnapshot.hasData) {
            return Center(child: Text('No attempts info available'));
          } else {
            final attemptsInfo = attemptsSnapshot.data;
            return FutureBuilder<List<int>>(
              future: _completedQuizzesFuture,
              builder: (context, completedQuizzesSnapshot) {
                if (completedQuizzesSnapshot.connectionState ==
                    ConnectionState.waiting) {
                  return Center(child: CircularProgressIndicator());
                } else if (completedQuizzesSnapshot.hasError) {
                  return Center(
                      child: Text('Error loading completed quizzes info'));
                } else {
                  final completedQuizzes = completedQuizzesSnapshot.data ?? [];
                  final isCompleted = completedQuizzes.contains(widget.quiz.id);
                  return QuizDetailContent(
                    quiz: widget.quiz,
                    userId: widget.userId,
                    attemptsInfo: attemptsInfo,
                    isCompleted: isCompleted,
                    onRefresh: () {
                      setState(() {
                        _attemptsInfoFuture = _fetchAttemptsInfo();
                        _completedQuizzesFuture = _fetchCompletedQuizzes();
                      });
                    },
                  );
                }
              },
            );
          }
        },
      ),
    );
  }
}

class QuizDetailContent extends StatefulWidget {
  final Quiz quiz;
  final int userId;
  final AttemptsInfo? attemptsInfo;
  final bool isCompleted;
  final VoidCallback onRefresh;

  QuizDetailContent({
    required this.quiz,
    required this.userId,
    required this.attemptsInfo,
    required this.isCompleted,
    required this.onRefresh,
  });

  @override
  _QuizDetailContentState createState() => _QuizDetailContentState();
}

class _QuizDetailContentState extends State<QuizDetailContent> {
  late int _timeLeft;
  Timer? _timer;
  late DateTime unlockDate;

  @override
  void initState() {
    super.initState();
    _timeLeft = widget.attemptsInfo?.timeLeft ?? 0;
    if (_timeLeft > 0) {
      unlockDate = DateTime.now().add(Duration(seconds: _timeLeft));
      _startTimer();
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _startTimer() {
    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      if (_timeLeft > 0) {
        setState(() {
          _timeLeft--;
        });
      } else {
        timer.cancel();
        widget.onRefresh();
      }
    });
  }

  String getFormattedTime(int seconds) {
    final duration = Duration(seconds: seconds);
    final hours = duration.inHours;
    final minutes = duration.inMinutes % 60;
    final remainingSeconds = duration.inSeconds % 60;

    return '${hours}h ${minutes}m ${remainingSeconds}s';
  }

  String getLockMessage() {
    if (_timeLeft <= 0) {
      final unlockDateFormatted = DateFormat('dd-MM-yyyy').format(unlockDate);
      return "Bạn đã hết lượt làm bài thi này. Hãy quay trở lại vào ngày $unlockDateFormatted nhé";
    }
    return '';
  }

  @override
  Widget build(BuildContext context) {
    String modifiedImageUrl = widget.quiz.imageUrl
        .replaceAll('http://localhost:8080', Endpoint.imageUrl);

    final isLocked = widget.attemptsInfo?.locked ?? false;

    if (!isLocked) {
      _timer?.cancel();
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Container(
        color: Colors.white, // Nền trắng cho toàn bộ nội dung
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: Image.network(
                modifiedImageUrl,
                width: double.infinity,
                height: 200,
                fit: BoxFit.cover,
              ),
            ),
            SizedBox(height: 20),
            Text(
              widget.quiz.title,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.black, // Màu chữ đen để dễ đọc
              ),
            ),
            SizedBox(height: 10),
            Text(
              widget.quiz.description,
              style: TextStyle(
                  fontSize: 16, color: Colors.black54), // Màu chữ xám nhạt
            ),
            SizedBox(height: 20),
            Card(
              margin: EdgeInsets.symmetric(vertical: 10),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
              elevation: 3,
              color: Colors.white, // Nền trắng cho card
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Thông tin bài đánh giá',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.black, // Màu chữ đen cho tiêu đề
                      ),
                    ),
                    SizedBox(height: 10),
                    if (!isLocked)
                      _buildInfoItem(
                        Icons.info,
                        'Số lần làm bài còn lại: ${widget.attemptsInfo?.attemptsLeft ?? 0}',
                      ),
                    if (isLocked)
                      _buildInfoItem(
                        Icons.timer,
                        _timeLeft > 0
                            ? 'Bạn đã hết lượt làm bài thi này. Hãy quay trở lại vào lúc: ${getFormattedTime(_timeLeft)}'
                            : getLockMessage(),
                      ),
                    _buildInfoItem(
                      Icons.help,
                      '10 câu hỏi nhiều đáp án',
                    ),
                    _buildInfoItem(
                      Icons.access_time,
                      '10 phút làm bài',
                    ),
                  ],
                ),
              ),
            ),
            SizedBox(height: 20),
            if (widget.isCompleted)
              Center(
                child: Text(
                  'Bạn đã hoàn thành bài thi này',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.green,
                  ),
                ),
              ),
            if (!widget.isCompleted)
              Center(
                child: ElevatedButton(
                  onPressed: isLocked
                      ? null
                      : () async {
                          await Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => QuizQuestionsPage(
                                quizId: widget.quiz.id,
                                userId: widget.userId,
                              ),
                            ),
                          );
                          widget.onRefresh();
                        },
                  style: ElevatedButton.styleFrom(
                    padding: EdgeInsets.symmetric(horizontal: 30, vertical: 15),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: Text(
                    'Bắt đầu làm bài',
                    style: TextStyle(fontSize: 16),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoItem(IconData icon, String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(
        children: [
          Icon(icon, size: 20, color: Colors.black54), // Màu icon xám nhạt
          SizedBox(width: 10),
          Expanded(
            child: Text(
              text,
              style: TextStyle(
                  fontSize: 14, color: Colors.black87), // Màu chữ xám đậm
            ),
          ),
        ],
      ),
    );
  }
}
