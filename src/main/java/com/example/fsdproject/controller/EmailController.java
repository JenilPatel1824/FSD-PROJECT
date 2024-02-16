package com.example.fsdproject.controller;

import com.example.fsdproject.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "${allowed.origins}")

@RequestMapping("/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @CrossOrigin(origins = "${allowed.origins}")
    @PostMapping("/send")
    public String sendEmail(
            @RequestParam String to,
            @RequestParam String subject,
            @RequestParam String body) {

        emailService.sendSimpleEmail(to, subject, body);

        return "Email sent successfully!";
    }
}
