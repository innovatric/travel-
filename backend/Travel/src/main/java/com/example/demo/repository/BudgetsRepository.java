package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.models.Budgets;

public interface BudgetsRepository extends JpaRepository<Budgets, Long> {

}