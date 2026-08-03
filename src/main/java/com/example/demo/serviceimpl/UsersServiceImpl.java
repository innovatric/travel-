
package com.example.demo.serviceimpl;

import com.example.demo.models.Users;
import com.example.demo.repository.UsersRepository;
import com.example.demo.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsersServiceImpl implements UsersService {

    @Autowired
    private UsersRepository usersRepository;

    @Override
    public Users saveUser(Users user) {
        return usersRepository.save(user);
    }

    @Override
    public List<Users> getAllUsers() {
        return usersRepository.findAll();
    }

    @Override
    public Optional<Users> getUserById(Long id) {
        return usersRepository.findById(id);
    }

    @Override
    public Users updateUser(Long id, Users user) {
        user.setUserId(id);
        return usersRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        usersRepository.deleteById(id);
    }
}
