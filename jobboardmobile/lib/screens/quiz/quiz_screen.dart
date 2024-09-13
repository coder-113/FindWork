import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:jobboardmobile/models/category_quiz_model.dart';
import 'package:jobboardmobile/service/categoryquiz_service.dart'
    as categoryquiz_service;
import 'package:jobboardmobile/service/quiz_service.dart' as quiz_service;
import 'package:jobboardmobile/models/quiz_model.dart';
import 'package:jobboardmobile/constant/endpoint.dart';
import 'quiz_detail_screen.dart';

class QuizListScreen extends StatefulWidget {
  @override
  _QuizListScreenState createState() => _QuizListScreenState();
}

class _QuizListScreenState extends State<QuizListScreen> {
  final categoryquiz_service.CategoryQuizService _categoryQuizService =
      categoryquiz_service.CategoryQuizService();
  final quiz_service.QuizService _quizService = quiz_service.QuizService();
  late Future<List<CategoryQuiz>> _futureCategories;
  final storage = FlutterSecureStorage();
  int? userId;
  Map<int, quiz_service.AttemptsInfo> attemptsInfo = {};
  String searchQuery = '';
  CategoryQuiz? selectedCategory;

  @override
  void initState() {
    super.initState();
    _initializeUserId();
    _futureCategories = _categoryQuizService.getAllCategories();
  }

  Future<void> _initializeUserId() async {
    String? storedUserId = await storage.read(key: 'userId');
    if (storedUserId != null) {
      setState(() {
        userId = int.parse(storedUserId);
      });
    } else {
      print('User ID not found in storage');
    }
  }

  void fetchAttemptsInfo(int quizId, int userId) async {
    try {
      final attemptsData = await _quizService.getAttemptsInfo(quizId, userId);
      setState(() {
        attemptsInfo[quizId] = quiz_service.AttemptsInfo.fromJson(attemptsData);
      });
    } catch (e) {
      print('Error fetching attempts info: $e');
    }
  }

  Widget customCard(Quiz quiz) {
    String modifiedImageUrl =
        quiz.imageUrl.replaceAll('http://localhost:8080', Endpoint.imageUrl);

    return Padding(
      padding: EdgeInsets.symmetric(vertical: 10.0, horizontal: 20.0),
      child: InkWell(
        onTap: () async {
          if (userId != null) {
            fetchAttemptsInfo(quiz.id, userId!);
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => QuizDetailScreen(
                  quiz: quiz,
                  userId: userId!,
                ),
              ),
            );
          } else {
            print('User ID is not available');
          }
        },
        child: Material(
          color: Colors.white,
          elevation: 5.0,
          borderRadius: BorderRadius.circular(15.0),
          child: Container(
            padding: EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                ClipRRect(
                  borderRadius: BorderRadius.circular(8.0),
                  child: Image.network(
                    modifiedImageUrl,
                    height: 150.0,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    loadingBuilder: (BuildContext context, Widget child,
                        ImageChunkEvent? loadingProgress) {
                      if (loadingProgress == null) return child;
                      return Center(
                        child: CircularProgressIndicator(
                          value: loadingProgress.expectedTotalBytes != null
                              ? loadingProgress.cumulativeBytesLoaded /
                                  (loadingProgress.expectedTotalBytes ?? 1)
                              : null,
                        ),
                      );
                    },
                    errorBuilder: (BuildContext context, Object error,
                        StackTrace? stackTrace) {
                      return Icon(Icons.error);
                    },
                  ),
                ),
                SizedBox(height: 10),
                Text(
                  quiz.title,
                  style: TextStyle(
                    fontSize: 18.0,
                    color: Colors.black,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 5),
                Text(
                  quiz.description ?? '',
                  style: TextStyle(
                    fontSize: 14.0,
                    color: Colors.grey[700],
                  ),
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                ),
                SizedBox(height: 10),
                ElevatedButton(
                  onPressed: () async {
                    if (userId != null) {
                      fetchAttemptsInfo(quiz.id, userId!);
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => QuizDetailScreen(
                            quiz: quiz,
                            userId: userId!,
                          ),
                        ),
                      );
                    } else {
                      print('User ID is not available');
                    }
                  },
                  child: Text('Take Quiz'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        iconTheme: IconThemeData(color: Colors.black),
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pushNamedAndRemoveUntil(
                context, '/main', (route) => false);
          },
        ),
        title: Text(
          'Quiz List',
          textAlign: TextAlign.center,
          style: TextStyle(
            color: Colors.black,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              decoration: InputDecoration(
                labelText: 'Search Quiz',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.search),
              ),
              onChanged: (value) {
                setState(() {
                  searchQuery = value;
                });
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: FutureBuilder<List<CategoryQuiz>>(
              future: _futureCategories,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return Center(child: Text('No categories found'));
                } else {
                  return DropdownButton<CategoryQuiz>(
                    isExpanded: true,
                    hint: Text('Select Category'),
                    value: selectedCategory,
                    onChanged: (CategoryQuiz? newValue) {
                      setState(() {
                        selectedCategory = newValue;
                      });
                    },
                    items: snapshot.data!.map((CategoryQuiz category) {
                      return DropdownMenuItem<CategoryQuiz>(
                        value: category,
                        child: Text(category.name),
                      );
                    }).toList(),
                  );
                }
              },
            ),
          ),
          Expanded(
            child: FutureBuilder<List<CategoryQuiz>>(
              future: _futureCategories,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return Center(child: Text('No quizzes found'));
                } else {
                  List<Quiz> filteredQuizzes = [];
                  snapshot.data!.forEach((category) {
                    if (selectedCategory == null ||
                        selectedCategory == category) {
                      filteredQuizzes.addAll(category.quizzes.where((quiz) =>
                          quiz.title
                              .toLowerCase()
                              .contains(searchQuery.toLowerCase())));
                    }
                  });

                  return ListView.builder(
                    padding: EdgeInsets.all(16),
                    itemCount: filteredQuizzes.length,
                    itemBuilder: (context, index) {
                      return customCard(filteredQuizzes[index]);
                    },
                  );
                }
              },
            ),
          ),
        ],
      ),
    );
  }
}
