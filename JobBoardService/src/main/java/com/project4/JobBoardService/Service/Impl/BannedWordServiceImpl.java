package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.Entity.BannedWord;
import com.project4.JobBoardService.Repository.BannedWordRepository;
import com.project4.JobBoardService.Service.BannedWordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class BannedWordServiceImpl implements BannedWordService {
    @Autowired
    private BannedWordRepository bannedWordRepository;

    @Override
    public List<String> getBannedWords() {
        return bannedWordRepository.findAll().stream()
                .map(BannedWord::getWord)
                .collect(Collectors.toList());
    }

    @Override
    public List<String> filterBannedWords(List<String> words) {
        List<String> bannedWords = getBannedWords();
        return words.stream()
                .filter(word -> bannedWords.contains(word.toLowerCase()))
                .distinct()
                .collect(Collectors.toList());
    }

    // Phương thức này không cần khai báo trong giao diện
    public String filterBannedWordsInText(String text, List<String> bannedWords) {
        String filteredText = text;
        for (String bannedWord : bannedWords) {
            String regex = "(?i)\\b" + Pattern.quote(bannedWord) + "\\b";
            filteredText = filteredText.replaceAll(regex, "*".repeat(bannedWord.length()));
        }
        return filteredText;
    }
}
