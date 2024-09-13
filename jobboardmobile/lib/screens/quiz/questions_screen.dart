import 'package:flutter/material.dart';
import 'package:html_unescape/html_unescape.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:uuid/uuid.dart';
import 'dart:convert';
import 'dart:async';
import 'dart:math';
import '../../models/questions_model.dart';
import '../../service/quiz_service.dart';

class QuizQuestionsPage extends StatefulWidget {
  final int quizId;
  final int userId;

  const QuizQuestionsPage({
    Key? key,
    required this.quizId,
    required this.userId,
  }) : super(key: key);

  @override
  _QuizQuestionsPageState createState() => _QuizQuestionsPageState();
}

class _QuizQuestionsPageState extends State<QuizQuestionsPage> {
  late List<Question> questions = [];
  late Map<String, String> selectedAnswers = {};
  int currentQuestionIndex = 0;
  int timeLeft = 10 * 60;
  late Timer timer;
  bool isLoading = true;

  final GlobalKey<ScaffoldState> _key = GlobalKey<ScaffoldState>();
  final TextStyle _questionStyle = const TextStyle(
      fontSize: 18.0, fontWeight: FontWeight.w500, color: Colors.black87);

  @override
  void initState() {
    super.initState();
    fetchQuizQuestions();
    startTimer();
  }

  @override
  void dispose() {
    timer.cancel();
    super.dispose();
  }

  void startTimer() {
    timer = Timer.periodic(const Duration(seconds: 1), (Timer t) {
      setState(() {
        if (timeLeft < 1) {
          t.cancel();
          handleSubmitQuiz();
        } else {
          timeLeft--;
        }
      });
    });
  }

  Future<void> fetchQuizQuestions() async {
    final String sessionIdKey = 'sessionId_${widget.quizId}';
    final String questionsKey = 'questions_${widget.quizId}';
    final SharedPreferences prefs = await SharedPreferences.getInstance();

    final sessionId = prefs.getString(sessionIdKey);
    final savedQuestions = prefs.getString(questionsKey);

    if (sessionId != null && savedQuestions != null) {
      setState(() {
        try {
          List<dynamic> decodedQuestions = json.decode(savedQuestions);
          List<Question> loadedQuestions = decodedQuestions
              .map((questionJson) => Question.fromJson(questionJson))
              .toList();

          loadedQuestions.shuffle(Random());
          questions = loadedQuestions.take(10).toList();
          isLoading = false;
        } catch (e) {
          print('Error decoding saved questions: $e');
          setState(() {
            isLoading = false;
            questions = []; // Ensure questions is set to empty on error
          });
        }
      });
    } else {
      final newSessionId = Uuid().v4();
      await prefs.setString(sessionIdKey, newSessionId);
      try {
        final fetchedQuestions = await QuizService.getQuizQuestions(
          widget.quizId.toString(),
          count: 50,
        );

        fetchedQuestions.shuffle(Random());
        setState(() {
          questions = fetchedQuestions
              .map((questionJson) => Question.fromJson(questionJson))
              .toList()
              .take(10)
              .toList();
          isLoading = false;
        });

        await prefs.setString(questionsKey, json.encode(fetchedQuestions));
      } catch (e) {
        print('Failed to load quiz questions: $e');
        setState(() {
          isLoading = false;
          questions = []; // Ensure questions is set to empty on error
        });
      }
    }
  }

  void handleNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      setState(() {
        currentQuestionIndex++;
      });
    }
  }

  void handlePrevQuestion() {
    if (currentQuestionIndex > 0) {
      setState(() {
        currentQuestionIndex--;
      });
    }
  }

  void handleAnswerSelect(String questionId, String answer) {
    setState(() {
      selectedAnswers[questionId] = answer;
    });
  }

  void handleSubmitQuiz() async {
    List<Map<String, dynamic>> submissionQuestions =
        selectedAnswers.keys.map((questionId) {
      String selectedAnswer = selectedAnswers[questionId]!;
      String correctAnswer = questions
          .firstWhere(
              (question) => question.id.toString() == questionId.toString())
          .correctAnswer;
      selectedAnswer = selectedAnswers[questionId]!.split(".")[0].trim();

      return {
        'questionId': int.parse(questionId),
        'selectedAnswer': selectedAnswer,
        'userAnswer': selectedAnswers[questionId],
      };
    }).toList();

    final submission = {
      'quizId': widget.quizId,
      'userId': widget.userId,
      'questions': submissionQuestions,
    };

    try {
      final dynamic response = await QuizService.submitQuiz(submission);

      if (response is Map<String, dynamic>) {
        final results = response['results'];
        final score = response['score'];

        Navigator.pushReplacementNamed(
          context,
          '/quiz/${widget.quizId}/result',
          arguments: {
            'results': results,
            'totalQuestions': questions.length,
            'score': score,
            'quizId': widget.quizId,
          },
        );
      } else {
        throw Exception('Invalid response from server');
      }
    } catch (error) {
      print('Error submitting quiz: $error');
    }
  }

  String formatTime(int seconds) {
    final minutes = seconds ~/ 60;
    final secs = seconds % 60;
    return '$minutes:${secs < 10 ? '0' : ''}$secs';
  }

  Future<bool> _showExitConfirmationDialog(BuildContext context) async {
    bool? result = await showDialog<bool>(
      context: context,
      builder: (_) {
        return AlertDialog(
          content: const Text(
              "Are you sure you want to quit the quiz? All your progress will be lost."),
          title: const Text("Warning!"),
          actions: <Widget>[
            TextButton(
              child: const Text("Yes"),
              onPressed: () {
                Navigator.pop(context, true);
              },
            ),
            TextButton(
              child: const Text("No"),
              onPressed: () {
                Navigator.pop(context, false);
              },
            ),
          ],
        );
      },
    );
    return result ?? false;
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        bool result = await _showExitConfirmationDialog(context);
        return result;
      },
      child: Scaffold(
        key: _key,
        appBar: AppBar(
          title: const Text('Quiz Questions'),
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () async {
              bool result = await _showExitConfirmationDialog(context);
              if (result == true) {
                Navigator.pop(context);
              }
            },
          ),
        ),
        body: isLoading
            ? const Center(child: CircularProgressIndicator())
            : questions.isEmpty
                ? const Center(
                    child: Text('No questions available for this quiz'))
                : Container(
                    color: Colors.grey[200],
                    child: Column(
                      children: <Widget>[
                        Container(
                          padding: const EdgeInsets.symmetric(
                              vertical: 20, horizontal: 20),
                          color: Theme.of(context).primaryColor,
                          child: Row(
                            children: <Widget>[
                              CircleAvatar(
                                backgroundColor: Colors.white70,
                                child: Text("${currentQuestionIndex + 1}"),
                              ),
                              const SizedBox(width: 16.0),
                              Expanded(
                                child: Text(
                                  HtmlUnescape().convert(
                                      questions[currentQuestionIndex]
                                          .questionText),
                                  softWrap: true,
                                  style: _questionStyle.copyWith(
                                      color: Colors.white),
                                ),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.all(20),
                          child: Text(
                            "Time Left: ${formatTime(timeLeft)}",
                            style: const TextStyle(
                                fontSize: 16, fontWeight: FontWeight.bold),
                          ),
                        ),
                        Expanded(
                          child: ListView(
                            padding: const EdgeInsets.all(20.0),
                            children: <Widget>[
                              Card(
                                elevation: 4,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Padding(
                                  padding: const EdgeInsets.all(12.0),
                                  child: Column(
                                    children: <Widget>[
                                      ...questions[currentQuestionIndex]
                                          .getOptionsList()
                                          .map((option) => RadioListTile(
                                                title: Text(HtmlUnescape()
                                                    .convert(option)),
                                                groupValue: selectedAnswers[
                                                    questions[
                                                            currentQuestionIndex]
                                                        .id
                                                        .toString()],
                                                value: option,
                                                onChanged: (value) {
                                                  handleAnswerSelect(
                                                      questions[
                                                              currentQuestionIndex]
                                                          .id
                                                          .toString(),
                                                      value!);
                                                },
                                              )),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(vertical: 20.0),
                          color: Colors.white,
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: <Widget>[
                              currentQuestionIndex > 0
                                  ? TextButton(
                                      child: const Text("Previous"),
                                      onPressed: handlePrevQuestion,
                                    )
                                  : const SizedBox(),
                              TextButton(
                                child: Text(currentQuestionIndex ==
                                        (questions.length - 1)
                                    ? "Submit"
                                    : "Next"),
                                onPressed: () {
                                  if (questions.isEmpty) {
                                    return; // Prevent further actions if no questions
                                  }
                                  if (currentQuestionIndex <
                                      questions.length - 1) {
                                    handleNextQuestion();
                                  } else {
                                    handleSubmitQuiz();
                                  }
                                },
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
      ),
    );
  }
}
