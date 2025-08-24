package com.example.lottery_app.service;

import com.example.lottery_app.entity.LotteryResult;
import com.example.lottery_app.entity.Participant;
import com.example.lottery_app.repository.LotteryResultRepository;
import com.example.lottery_app.repository.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class LotteryService {

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private LotteryResultRepository lotteryResultRepository;

    public Participant addParticipant(Participant participant) {
        return participantRepository.save(participant);
    }

    public LotteryResult drawWinner() {
        List<Participant> participants = participantRepository.findAll();
        if (participants.isEmpty()) {
            throw new RuntimeException("No participants to draw a winner.");
        }

        Random random = new Random();
        int randomIndex = random.nextInt(participants.size());
        Participant winner = participants.get(randomIndex);

        LotteryResult lotteryResult = new LotteryResult(winner.getName(), LocalDateTime.now());
        lotteryResultRepository.save(lotteryResult);

        participantRepository.deleteAll(); // Clear participants after draw

        return lotteryResult;
    }

    public List<Participant> getAllParticipants() {
        return participantRepository.findAll();
    }

    public List<LotteryResult> getAllLotteryResults() {
        return lotteryResultRepository.findAll();
    }
}
