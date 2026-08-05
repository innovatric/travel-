
package com.example.demo.service;

import com.example.demo.models.Users;
import java.util.List;
import java.util.Optional;

public interface UsersService {

    Users saveUser(Users user);

    List<Users> getAllUsers();

    Optional<Users> getUserById(Long id);

    Users updateUser(Long id, Users user);

    void deleteUser(Long id);
}
