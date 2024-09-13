import 'package:flutter/material.dart';
import 'package:jobboardmobile/screens/quiz/quiz_screen.dart';

class QuizResultPage extends StatelessWidget {
  final Map<String, dynamic> arguments;

  QuizResultPage({required this.arguments});

  @override
  Widget build(BuildContext context) {
    final results = arguments['results'] as List<dynamic>;
    final totalQuestions = arguments['totalQuestions'] as int;
    final score = arguments['score'] is int
        ? (arguments['score'] as int).toDouble()
        : arguments['score'] as double;
    final quizId = arguments['quizId'] as int;

    List<String> images = [
      "assets/images/success.png",
      "assets/images/good.png",
      "assets/images/bad.png",
    ];

    String message;
    String image;

    if (score <= 4) {
      image = images[2];
      message = "You Should Try Hard..\nYou Scored $score";
    } else if (score <= 7) {
      image = images[1];
      message = "You Can Do Better..\nYou Scored $score";
    } else {
      image = images[0];
      message =
          "You Did Very Well..\nYou Scored $score\n\nCongratulations! You've earned our certificate. Check your email for the certificate, which will be sent to you shortly.";
    }
    return Scaffold(
      appBar: AppBar(
        title: Text("Quiz Result"),
      ),
      body: Container(
        padding: EdgeInsets.all(16.0),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.white, Colors.lightBlue.shade50],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SingleChildScrollView(
          child: Column(
            children: <Widget>[
              Material(
                elevation: 10.0,
                borderRadius: BorderRadius.circular(10.0),
                child: Container(
                  padding: EdgeInsets.all(16.0),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(10.0),
                  ),
                  child: Column(
                    children: <Widget>[
                      Container(
                        width: 200.0,
                        height: 200.0,
                        child: ClipRect(
                          child: Image.asset(image),
                        ),
                      ),
                      Padding(
                        padding: EdgeInsets.symmetric(
                          vertical: 10.0,
                        ),
                        child: Center(
                          child: Text(
                            message,
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 20.0,
                              fontWeight: FontWeight.bold,
                              color: Colors.black87,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Padding(
                padding: EdgeInsets.symmetric(horizontal: 16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ListView.builder(
                      shrinkWrap: true,
                      physics: NeverScrollableScrollPhysics(),
                      itemCount: results.length,
                      itemBuilder: (context, index) {
                        final result = results[index];
                        final question = result['question'];
                        final userAnswer = result['userAnswer'];
                        final correctAnswer = result['correctAnswer'];
                      },
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 20.0),
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).pushReplacement(MaterialPageRoute(
                      builder: (context) => QuizListScreen(),
                    ));
                  },
                  child: Text(
                    "Continue",
                    style: TextStyle(
                      fontSize: 18.0,
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.indigoAccent,
                    padding: EdgeInsets.symmetric(
                      vertical: 12.0,
                      horizontal: 24.0,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8.0),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
