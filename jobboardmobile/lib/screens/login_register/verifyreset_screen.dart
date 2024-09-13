import 'package:flutter/material.dart';
import '../../service/auth_service.dart';

class VerifyResetScreen extends StatefulWidget {
  final String email;

  VerifyResetScreen({required this.email});

  @override
  _VerifyResetScreenState createState() => _VerifyResetScreenState();
}

class _VerifyResetScreenState extends State<VerifyResetScreen> {
  final AuthService _authService = AuthService();
  final TextEditingController _codeController = TextEditingController();
  String _errorMessage = '';

  void _verifyCode() async {
    try {
      String code = _codeController.text;
      final response =
          await _authService.verifyResetPassWord(widget.email, code);

      if (response.containsKey('message') &&
          response['message'].startsWith(
              'Email verified successfully! Use the token to reset your password: ')) {
        String resetToken = response['message'].split(': ').last.trim();

        _showSnackBar('Email verified successfully!');

        Navigator.pushReplacementNamed(
          context,
          '/reset_password',
          arguments: {'email': widget.email, 'resetToken': resetToken},
        );
      } else {
        setState(() {
          _errorMessage = 'Invalid verification code.';
        });
      }
    } catch (e) {
      print('Error verifying code: $e');
      setState(() {
        _errorMessage = 'Failed to verify code.';
      });
    }
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        duration: Duration(seconds: 3),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: <Widget>[
          Container(
            decoration: BoxDecoration(
              image: DecorationImage(
                image: AssetImage('assets/images/hero_1.jpg'),
                fit: BoxFit.fitWidth,
                alignment: Alignment.topCenter,
              ),
            ),
          ),
          Container(
            width: MediaQuery.of(context).size.width,
            margin: EdgeInsets.only(top: 220),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              color: Colors.white,
            ),
            child: Padding(
              padding: EdgeInsets.all(23),
              child: ListView(
                children: <Widget>[
                  Padding(
                    padding: EdgeInsets.fromLTRB(0, 20, 0, 10),
                    child: Container(
                      color: Color(0xfff5f5f5),
                      child: TextFormField(
                        controller: _codeController,
                        style: TextStyle(
                          color: Colors.black,
                          fontFamily: 'SFUIDisplay',
                        ),
                        decoration: InputDecoration(
                          border: OutlineInputBorder(),
                          labelText: 'Verification Code',
                          prefixIcon: Icon(Icons.lock_outline),
                          labelStyle: TextStyle(
                            fontSize: 15,
                          ),
                        ),
                      ),
                    ),
                  ),
                  Padding(
                    padding: EdgeInsets.only(top: 20),
                    child: MaterialButton(
                      onPressed: _verifyCode,
                      child: Text(
                        'VERIFY CODE',
                        style: TextStyle(
                          fontSize: 15,
                          fontFamily: 'SFUIDisplay',
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      color: Color.fromARGB(255, 45, 255, 132),
                      elevation: 0,
                      minWidth: 400,
                      height: 50,
                      textColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  ),
                  Padding(
                    padding: EdgeInsets.symmetric(vertical: 10),
                    child: Center(
                      child: Text(
                        'Check your email for the verification code to reset your password.',
                        style: TextStyle(
                          fontFamily: 'SFUIDisplay',
                          fontSize: 14,
                          color: Colors.black54,
                        ),
                      ),
                    ),
                  ),
                  if (_errorMessage.isNotEmpty)
                    Padding(
                      padding: EdgeInsets.only(top: 20),
                      child: Center(
                        child: Text(
                          _errorMessage,
                          style: TextStyle(
                            fontFamily: 'SFUIDisplay',
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                            color: Colors.red,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
