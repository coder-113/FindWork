import 'package:shared_preferences/shared_preferences.dart';

class LikeStorage {
  // Save the like status for a specific review and user
  static Future<void> saveLikeStatus(
      int reviewId, String username, bool liked) async {
    final prefs = await SharedPreferences.getInstance();
    final key = 'like_status_${reviewId}_$username';
    await prefs.setBool(key, liked);
  }

  // Retrieve the like status for a specific review and user
  static Future<bool> getLikeStatus(int reviewId, String username) async {
    final prefs = await SharedPreferences.getInstance();
    final key = 'like_status_${reviewId}_$username';
    return prefs.getBool(key) ?? false;
  }
}
