package com.invoicingproject.spine.repository;

import com.invoicingproject.spine.entity.EmployeeRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRoleRepository extends JpaRepository<EmployeeRole, Long> {

    Optional<EmployeeRole> findByRoleName(String roleName);

    List<EmployeeRole> findByIsActiveTrue();

    boolean existsByRoleName(String roleName);
}
