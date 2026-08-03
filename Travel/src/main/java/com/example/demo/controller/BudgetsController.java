
package com.example.demo.controller;

import com.example.demo.models.Budgets;
import com.example.demo.service.BudgetsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/budgets")
@CrossOrigin(origins = "*")
public class BudgetsController {

    @Autowired
    private BudgetsService budgetsService;

    @PostMapping
    public Budgets saveBudget(@RequestBody Budgets budget) {
        return budgetsService.saveBudget(budget);
    }

    @GetMapping
    public List<Budgets> getAllBudgets() {
        return budgetsService.getAllBudgets();
    }

    @GetMapping("/{id}")
    public Optional<Budgets> getBudgetById(@PathVariable Long id) {
        return budgetsService.getBudgetById(id);
    }

    @PutMapping("/{id}")
    public Budgets updateBudget(@PathVariable Long id,
                                @RequestBody Budgets budget) {
        return budgetsService.updateBudget(id, budget);
    }

    @DeleteMapping("/{id}")
    public void deleteBudget(@PathVariable Long id) {
        budgetsService.deleteBudget(id);
    }
}