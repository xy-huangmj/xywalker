package com.example.lottery_app.controller;

import com.example.lottery_app.entity.Participant;
import com.example.lottery_app.service.LotteryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/participants")
public class ParticipantController {

    @Autowired
    private LotteryService lotteryService;

    @PostMapping
    public Participant addParticipant(@RequestBody Participant participant) {
        return lotteryService.addParticipant(participant);
    }

    @GetMapping
    public List<Participant> getAllParticipants() {
        return lotteryService.getAllParticipants();
    }
}
