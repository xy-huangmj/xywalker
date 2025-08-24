package com.example.lottery_app.repository;

import com.example.lottery_app.entity.LotteryResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LotteryResultRepository extends JpaRepository<LotteryResult, Long> {
}
