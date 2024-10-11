<?php
class Driver
{
    public $ID;
    public $KIDSDRIV;
    public $AGE;
    public $INCOME;
    public $MSTATUS;
    public $GENDER;
    public $EDUCATION;
    public $OCCUPATION;

    public function __construct($id, $kidsDrive, $age, $income, $mStatus, $gender, $education, $occupation)
    {
        $this->ID = $id;
        $this->KIDSDRIV = $kidsDrive;
        $this->AGE = $age;
        $this->INCOME = $income;
        $this->MSTATUS = $mStatus;
        $this->GENDER = $gender;
        $this->EDUCATION = $education;
        $this->OCCUPATION = $occupation;
    }

    public function getId()
    {
        return $this->ID;
    }

    public function getKidsDrive()
    {
        return $this->KIDSDRIV;
    }

    public function getAge()
    {
        return $this->AGE;
    }

    public function getIncome()
    {
        return $this->INCOME;
    }

    public function getMStatus()
    {
        return $this->MSTATUS;
    }

    public function getGender()
    {
        return $this->GENDER;
    }

    public function getEducation()
    {
        return $this->EDUCATION;
    }

    public function getOccupation()
    {
        return $this->OCCUPATION;
    }
}
?>
