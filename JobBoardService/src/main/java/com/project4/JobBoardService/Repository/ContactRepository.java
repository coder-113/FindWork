package com.project4.JobBoardService.Repository;

import com.project4.JobBoardService.Entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    List<Contact> findByArchived(boolean archived);

}