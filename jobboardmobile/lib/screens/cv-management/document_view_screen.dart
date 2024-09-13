import 'dart:convert';
import 'package:lottie/lottie.dart';
import '../../models/pdf_model.dart';
import '../../service/pdfDocument_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_pdfview/flutter_pdfview.dart';
import 'dart:io';
import 'package:path_provider/path_provider.dart';

class DocumentViewScreen extends StatefulWidget {
  final int documentId;

  DocumentViewScreen({required this.documentId});

  @override
  _DocumentViewScreenState createState() => _DocumentViewScreenState();
}

class _DocumentViewScreenState extends State<DocumentViewScreen> {
  final PdfDocumentService _documentService = PdfDocumentService();
  late Future<PdfDocument> _futureDocument;

  @override
  void initState() {
    super.initState();
    _futureDocument = _documentService.fetchDocumentById(widget.documentId);
  }

  Future<String> _getFileFromBase64(String base64String) async {
    final bytes = Base64Decoder().convert(base64String);
    final dir = await getApplicationDocumentsDirectory();
    final file = File('${dir.path}/document.pdf');
    await file.writeAsBytes(bytes);
    return file.path;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: Text('Document Viewer', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFF89BA16), Color(0xFF89BA16).withOpacity(0.7)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
        ),
      ),
      body: Stack(
        children: [
          FutureBuilder<PdfDocument>(
            future: _futureDocument,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return Center(
                  child: CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF89BA16)),
                  ),
                );
              } else if (snapshot.hasError) {
                return _buildErrorWidget(snapshot.error.toString());
              } else if (!snapshot.hasData) {
                return _buildErrorWidget('Document not found');
              } else {
                return FutureBuilder<String>(
                  future: _getFileFromBase64(snapshot.data!.pdfContent),
                  builder: (context, filePathSnapshot) {
                    if (filePathSnapshot.connectionState == ConnectionState.waiting) {
                      return Center(
                        child: CircularProgressIndicator(
                          valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF89BA16)),
                        ),
                      );
                    } else if (filePathSnapshot.hasError) {
                      return _buildErrorWidget(filePathSnapshot.error.toString());
                    } else {
                      return PDFView(
                        filePath: filePathSnapshot.data,
                        enableSwipe: true,
                        swipeHorizontal: true,
                        autoSpacing: false,
                        pageFling: true,
                        pageSnap: true,
                        fitPolicy: FitPolicy.BOTH,
                      );
                    }
                  },
                );
              }
            },
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Implement share or download functionality
        },
        child: Icon(Icons.share),
        backgroundColor: Color(0xFF89BA16),
      ),
    );
  }

  Widget _buildErrorWidget(String errorMessage) {
    return Center(
      child: Container(
        padding: EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(8),
          boxShadow: [
            BoxShadow(color: Colors.grey.withOpacity(0.5), blurRadius: 5, offset: Offset(0, 3)),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.error_outline, color: Color(0xFF89BA16), size: 48),
            SizedBox(height: 16),
            Text(
              'Error',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF89BA16)),
            ),
            SizedBox(height: 8),
            Text(errorMessage, textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }
}
