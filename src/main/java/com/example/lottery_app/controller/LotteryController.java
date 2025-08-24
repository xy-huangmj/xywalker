package com.example.lottery_app.controller;

import com.example.lottery_app.entity.LotteryResult;
import com.example.lottery_app.service.LotteryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/lottery")
public class LotteryController {

    @Autowired
    private LotteryService lotteryService;

    @PostMapping("/draw")
    public LotteryResult drawWinner() {
        return lotteryService.drawWinner();
    }

    @GetMapping("/results")
    public List<LotteryResult> getAllLotteryResults() {
        return lotteryService.getAllLotteryResults();
    }
}
