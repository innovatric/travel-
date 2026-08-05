
package com.example.demo.service;

import com.example.demo.models.Budgets;

import java.util.List;
import java.util.Optional;

public interface BudgetsService {

    Budgets saveBudget(Budgets budget);

    List<Budgets> getAllBudgets();

    Optional<Budgets> getBudgetById(Long id);

    Budgets updateBudget(Long id, Budgets budget);

    void deleteBudget(Long id);
}