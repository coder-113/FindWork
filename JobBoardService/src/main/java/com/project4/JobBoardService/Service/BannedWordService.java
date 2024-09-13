package com.project4.JobBoardService.Service;

import java.util.List;

public interface BannedWordService {
    List<String> getBannedWords();
    List<String> filterBannedWords(List<String> words);

    String filterBannedWordsInText(String description, List<String> bannedWords);
}
