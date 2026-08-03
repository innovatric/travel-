
package com.example.demo.serviceimpl;

import com.example.demo.models.Budgets;
import com.example.demo.repository.BudgetsRepository;
import com.example.demo.service.BudgetsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BudgetsServiceImpl implements BudgetsService {

    @Autowired
    private BudgetsRepository budgetsRepository;

    @Override
    public Budgets saveBudget(Budgets budget) {
        return budgetsRepository.save(budget);
    }

    @Override
    public List<Budgets> getAllBudgets() {
        return budgetsRepository.findAll();
    }

    @Override
    public Optional<Budgets> getBudgetById(Long id) {
        return budgetsRepository.findById(id);
    }

    @Override
    public Budgets updateBudget(Long id, Budgets budget) {
        budget.setBudgetId(id);
        return budgetsRepository.save(budget);
    }

    @Override
    public void deleteBudget(Long id) {
        budgetsRepository.deleteById(id);
    }
}