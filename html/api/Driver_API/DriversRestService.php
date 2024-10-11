<?php
    require "dbinfo.php";
    require "RestService.php";
    require "Driver.php";

    class DriversRestService extends RestService 
    {
        private $drivers;

        public function __construct() 
        {
            parent::__construct("drivers");
        }

        public function performGet($url, $parameters, $requestBody, $accept) 
        {
            switch (count($parameters))
            {
                case 1:
                    header('Content-Type: application/json; charset=utf-8');
                    header('no-cache,no-store');
                    $this->getAllDrivers();
                    echo json_encode($this->drivers);
                    break;

                case 2:
                    $id = $parameters[1];
                    $driver = $this->getDriverById($id);
                    if ($driver != null)
                    {
                        header('Content-Type: application/json; charset=utf-8');
                        header('no-cache,no-store');
                        echo json_encode($driver);
                    }
                    else
                    {
                        $this->notFoundResponse();
                    }
                    break;

                default:    
                    $this->methodNotAllowedResponse();
            }
        }

        public function performPost($url, $parameters, $requestBody, $accept) 
        {
            global $dbserver, $dbusername, $dbpassword, $dbdatabase;

            $newDriver = $this->extractDriverFromJSON($requestBody);
            $connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
            if (!$connection->connect_error)
            {
                $sql = "INSERT INTO drivers (ID, KIDSDRIV, AGE, INCOME, MSTATUS, GENDER, EDUCATION, OCCUPATION) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                $statement = $connection->prepare($sql);
                $driverId = $newDriver->getId();
                $kidsDrive = $newDriver->getKidsDrive();
                $age = $newDriver->getAge();
                $income = $newDriver->getIncome();
                $mstatus = $newDriver->getMStatus();
                $gender = $newDriver->getGender();
                $education = $newDriver->getEducation();
                $occupation = $newDriver->getOccupation();
                $statement->bind_param('iiidisss', $driverId, $kidsDrive, $age, $income, $mstatus, $gender, $education, $occupation);
                $result = $statement->execute();
                if ($result == FALSE)
                {
                    $errorMessage = $statement->error;
                }
                $statement->close();
                $connection->close();
                if ($result == TRUE)
                {
                    $this->noContentResponse();
                }
                else
                {
                    $this->errorResponse($errorMessage);
                }
            }
        }

        public function performPut($url, $parameters, $requestBody, $accept) 
        {
            global $dbserver, $dbusername, $dbpassword, $dbdatabase;

            $newDriver = $this->extractDriverFromJSON($requestBody);
            $connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
            if (!$connection->connect_error)
            {
                $sql = "update drivers set KIDSDRIV = ?, AGE = ?, INCOME = ?, MSTATUS = ?, GENDER = ?, EDUCATION = ?, OCCUPATION = ? where ID = ?";
                $statement = $connection->prepare($sql);
                $driverId = $newDriver->getId();
                $kidsDrive = $newDriver->getKidsDrive();
                $age = $newDriver->getAge();
                $income = $newDriver->getIncome();
                $mstatus = $newDriver->getMStatus();
                $gender = $newDriver->getGender();
                $education = $newDriver->getEducation();
                $occupation = $newDriver->getOccupation();
                $statement->bind_param('iidisssi', $kidsDrive, $age, $income, $mstatus, $gender, $education, $occupation, $driverId);
                $result = $statement->execute();
                if ($result == FALSE)
                {
                    $errorMessage = $statement->error;
                }
                $statement->close();
                $connection->close();
                if ($result == TRUE)
                {
                    $this->noContentResponse();
                }
                else
                {
                    $this->errorResponse($errorMessage);
                }
            }
        }

        public function performDelete($url, $parameters, $requestBody, $accept) 
        {
            global $dbserver, $dbusername, $dbpassword, $dbdatabase;

	    if (count($parameters) == 2)
	    {
		$connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
		if (!$connection->connect_error)
		{
		    $id = $parameters[1];
		    $sql = "delete from drivers where ID = ?";
		    $statement = $connection->prepare($sql);
		    $statement->bind_param('i', $id);
		    $result = $statement->execute();
		    if ($result == FALSE)
		    {
		    	$errorMessage = $statement->error;
		    }
		    $statement->close();
		    $connection->close();
		    if ($result == TRUE)
		    {
		    	// We need to return the status as 204 (no content) rather than 200 (OK) since
		    	// we are not returning any data
		    	$this->noContentResponse();
		    }
		    else
		    {
		        $this->errorResponse($errorMessage);
		    }
	        }
	    }
        }


        private function getAllDrivers()
        {
            global $dbserver, $dbusername, $dbpassword, $dbdatabase;

            $connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
            if (!$connection->connect_error)
            {
                $query = "SELECT ID, KIDSDRIV, AGE, INCOME, MSTATUS, GENDER, EDUCATION, OCCUPATION FROM drivers";
                if ($result = $connection->query($query))
                {
                    while ($row = $result->fetch_assoc())
                    {
                        $this->drivers[] = new Driver($row["ID"], $row["KIDSDRIV"], $row["AGE"], $row["INCOME"], $row["MSTATUS"], $row["GENDER"], $row["EDUCATION"], $row["OCCUPATION"]);
                    }
                    $result->close();
                }
                $connection->close();
            }
        }   

        private function getDriverById($id)
        {
            global $dbserver, $dbusername, $dbpassword, $dbdatabase;

            $connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
            if (!$connection->connect_error)
            {
                $query = "SELECT KIDSDRIV, AGE, INCOME, MSTATUS, GENDER, EDUCATION, OCCUPATION FROM drivers WHERE ID = ?";
                $statement = $connection->prepare($query);
                $statement->bind_param('i', $id);
                $statement->execute();
                $statement->store_result();
                $statement->bind_result($kidsDrive, $age, $income, $mstatus, $gender, $education, $occupation);
                if ($statement->fetch())
                {
                    return new Driver($id, $kidsDrive, $age, $income, $mstatus, $gender, $education, $occupation);
                }
                else
                {
                    return null;
                }
                $statement->close();
                $connection->close();
            }
        }

        private function extractDriverFromJSON($requestBody)
        {
            $driverArray = json_decode($requestBody, true);
            $driver = new Driver($driverArray['ID'], 
                                 $driverArray['KIDSDRIV'], 
                                 $driverArray['AGE'], 
                                 $driverArray['INCOME'], 
                                 $driverArray['MSTATUS'], 
                                 $driverArray['GENDER'], 
                                 $driverArray['EDUCATION'], 
                                 $driverArray['OCCUPATION']);
            unset($driverArray);
            return $driver;
        }
    }
?>
