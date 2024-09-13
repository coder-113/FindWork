import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:jobboardmobile/models/review_model.dart';
import 'package:jobboardmobile/service/auth_service.dart';
import 'package:jobboardmobile/service/review_service.dart';
import 'package:jobboardmobile/constant/endpoint.dart';
import 'dart:math';
import 'package:flutter_html/flutter_html.dart';
import 'package:flutter/src/painting/edge_insets.dart';

import '../../dto/LikeResponse.dart';
import '../../dto/LikeStorage.dart';

class CompanyReviewScreen extends StatefulWidget {
  final int companyId;

  const CompanyReviewScreen({super.key, required this.companyId});

  @override
  _CompanyReviewScreenState createState() => _CompanyReviewScreenState();
}

class _CompanyReviewScreenState extends State<CompanyReviewScreen> {
  final ReviewService _reviewService = ReviewService();
  final AuthService _authService = AuthService();
  List<Review> _reviews = [];
  bool _hasReviewed = false;
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  double _rating = 0.0;
  String? _username;

  @override
  void initState() {
    super.initState();
    _fetchUserInfo();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _fetchReviews();
  }

  Future<void> _fetchUserInfo() async {
    try {
      final username = await _authService.getUsername();
      setState(() {
        _username = username;
      });
      if (_username != null) {
        await _fetchReviews();
        await _checkUserReviewStatus();
      }
    } catch (e) {
      print('Failed to fetch user info: $e');
    }
  }

  Future<void> _fetchReviews() async {
    try {
      final reviews = await _reviewService.getAllReviews(widget.companyId);
      List<Review> updatedReviews = [];
      for (var review in reviews) {
        bool isLiked = _username != null
            ? await LikeStorage.getLikeStatus(review.id, _username!)
            : false;
        updatedReviews.add(review.copyWith(likedByCurrentUser: isLiked));
      }
      // Sort reviews by like count in descending order
      updatedReviews.sort((a, b) => b.likeCount.compareTo(a.likeCount));

      setState(() {
        _reviews = updatedReviews;
      });
    } catch (e) {
      print('Failed to load reviews: $e');
    }
  }

  Future<void> _checkUserReviewStatus() async {
    try {
      if (_username != null) {
        final hasReviewed =
            await _reviewService.hasUserReviewedCompany(widget.companyId);
        setState(() {
          _hasReviewed = hasReviewed;
        });
      }
    } catch (e) {
      print('Failed to check review status: $e');
    }
  }

  Future<void> _addReview() async {
    if (_titleController.text.isEmpty || _descriptionController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Title and description cannot be empty'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    if (_username == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('User not logged in'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    try {
      final review = Review(
        id: 0,
        title: _titleController.text,
        description: _descriptionController.text,
        rating: _rating,
        company: '',
        user: '',
        username: _username!,
        imageUrl: '',
        likeCount: 0,
        likedByCurrentUser: false,
      );

      final savedReview =
          await _reviewService.addReview(widget.companyId, review);

      setState(() {
        _titleController.clear();
        _descriptionController.clear();
        _rating = 0.0;
        _hasReviewed = true;
        _reviews.add(savedReview);
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Review added successfully'),
          backgroundColor: Colors.green,
          duration: Duration(seconds: 2),
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to add review: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> _likeReview(Review review) async {
    setState(() {
      review.likeCount++;
      review.likedByCurrentUser = true;
    });

    try {
      LikeResponse response =
          await _reviewService.likeReview(widget.companyId, review.id);
      if (response.success) {
        if (_username != null) {
          await LikeStorage.saveLikeStatus(review.id, _username!, true);
        }
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text(response.message), backgroundColor: Colors.green),
        );
      } else {
        setState(() {
          review.likeCount--;
          review.likedByCurrentUser = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('Failed to like review: ${response.message}'),
              backgroundColor: Colors.red),
        );
      }
    } catch (e) {
      setState(() {
        review.likeCount--;
        review.likedByCurrentUser = false;
      });
      print('Failed to like review: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Text('Failed to like review: $e'),
            backgroundColor: Colors.red),
      );
    }
  }

  Future<void> _unlikeReview(Review review) async {
    setState(() {
      review.likeCount = max(0, review.likeCount - 1);
      review.likedByCurrentUser = false;
    });

    try {
      final response =
          await _reviewService.unlikeReview(widget.companyId, review.id);
      if (response.success) {
        if (_username != null) {
          await LikeStorage.saveLikeStatus(review.id, _username!, false);
        }
      } else {
        setState(() {
          review.likeCount++;
          review.likedByCurrentUser = true;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to unlike: ${response.message}')),
        );
      }
    } catch (e) {
      print('Error unliking review: $e');
      setState(() {
        review.likeCount++;
        review.likedByCurrentUser = true;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text('Error unliking review. Please try again.')),
      );
    }
  }

  void _showReviewDialog() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Add Review',
              style: TextStyle(fontWeight: FontWeight.bold)),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                TextField(
                  controller: _titleController,
                  decoration: const InputDecoration(
                    labelText: 'Title',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.title),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _descriptionController,
                  decoration: const InputDecoration(
                    labelText: 'Description',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.description),
                  ),
                  maxLines: 3,
                ),
                const SizedBox(height: 16),
                const Text('Rating:',
                    style:
                        TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                RatingBar.builder(
                  initialRating: _rating,
                  minRating: 1,
                  direction: Axis.horizontal,
                  allowHalfRating: true,
                  itemCount: 5,
                  itemPadding: const EdgeInsets.symmetric(horizontal: 4.0),
                  itemBuilder: (context, _) => const Icon(
                    Icons.star,
                    color: Colors.amber,
                  ),
                  onRatingUpdate: (rating) {
                    setState(() {
                      _rating = rating;
                    });
                  },
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                _addReview();
              },
              style: ElevatedButton.styleFrom(
                foregroundColor: Colors.white,
                backgroundColor: Colors.blue,
              ),
              child: const Text('Submit'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Company Reviews'),
        backgroundColor: Colors.blue,
        elevation: 0,
      ),
      backgroundColor: Colors.grey[100],
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Reviews',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: _reviews.isEmpty
                  ? const Center(
                      child: Text(
                        'No reviews available',
                        style: TextStyle(fontSize: 18, color: Colors.grey),
                      ),
                    )
                  : _buildReviewsList(),
            ),
          ],
        ),
      ),
      floatingActionButton: _hasReviewed
          ? null
          : FloatingActionButton.extended(
              onPressed: _showReviewDialog,
              icon: const Icon(Icons.rate_review),
              label: const Text('Add Review'),
              backgroundColor: Colors.blue,
            ),
    );
  }

  Widget _buildReviewsList() {
    return ListView.separated(
      itemCount: _reviews.length,
      separatorBuilder: (context, index) => const Divider(),
      itemBuilder: (context, index) {
        final review = _reviews[index];
        return _buildReviewCard(review);
      },
    );
  }

  Widget _buildReviewCard(Review review) {
    String modifiedImageUrl = review.imageUrl.isNotEmpty
        ? review.imageUrl.replaceAll('http://localhost:8080', Endpoint.imageUrl)
        : 'https://bootdey.com/img/Content/avatar/avatar6.png';

    return Card(
      elevation: 2,
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundImage: NetworkImage(modifiedImageUrl),
                  radius: 24,
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        review.username,
                        style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                            color: Color.fromARGB(205, 98, 98, 98)),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              review.title,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            // Sử dụng widget Html để render nội dung HTML
            Html(
              data: review.description,
              style: {
                "html": Style(
                  fontSize: FontSize(16.0),
                  color: Colors.black,
                  padding: HtmlPaddings.all(0),
                ),
              },
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                RatingBarIndicator(
                  rating: review.rating,
                  itemBuilder: (context, index) => const Icon(
                    Icons.star,
                    color: Colors.amber,
                  ),
                  itemCount: 5,
                  itemSize: 20.0,
                  direction: Axis.horizontal,
                ),
                Row(
                  children: [
                    Text(
                      review.likeCount.toString(),
                      style: const TextStyle(
                          fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(width: 8),
                    IconButton(
                      icon: Icon(
                        review.likedByCurrentUser
                            ? Icons.thumb_up
                            : Icons.thumb_up_alt_outlined,
                        color: review.likedByCurrentUser ? Colors.blue : null,
                      ),
                      onPressed: () {
                        review.likedByCurrentUser
                            ? _unlikeReview(review)
                            : _likeReview(review);
                      },
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
