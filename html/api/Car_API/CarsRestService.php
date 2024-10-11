<?php
    require "dbinfo.php";
    require "RestService.php";
    require "Car.php";

    class CarsRestService extends RestService 
    {
        private $cars;

        public function __construct() 
        {
            parent::__construct("cars");
        }

        public function performGet($url, $parameters, $requestBody, $accept) 
        {
            switch (count($parameters))
            {
                case 1:
                    header('Content-Type: application/json; charset=utf-8');
                    header('no-cache,no-store');
                    $this->getAllCars();
                    echo json_encode($this->cars);
                    break;

                case 2:
                    $id = $parameters[1];
                    $car = $this->getCarById($id);
                    if ($car != null)
                    {
                        header('Content-Type: application/json; charset=utf-8');
                        header('no-cache,no-store');
                        echo json_encode($car);
                    }
                    else
                    {
                        $this->notFoundResponse();
                    }
                    break;
		case 3:
		    $driverId = $parameters[2];
		    $cars = $this->getCarByDriverId($driverId);
		    if (!empty($cars))
                    {
                        header('Content-Type: application/json; charset=utf-8');
                        header('no-cache,no-store');
                        echo json_encode($cars);
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

            $newCar = $this->extractCarFromJSON($requestBody);
            $connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
            if (!$connection->connect_error)
            {
                $sql = "INSERT INTO cars (CAR_ID, CAR_TYPE, RED_CAR, CAR_AGE, DRIVER_ID) VALUES (?, ?, ?, ?, ?)";
                $statement = $connection->prepare($sql);
                $carId = $newCar->getCarId();
                $carType = $newCar->getCarType();
                $redCar = $newCar->getRedCar();
                $carAge = $newCar->getCarAge();
                $driverId = $newCar->getDriverId();
                $statement->bind_param('isiii', $carId, $carType, $redCar, $carAge, $driverId);
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

            $newCar = $this->extractCarFromJSON($requestBody);
            $connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
            if (!$connection->connect_error)
            {
                $sql = "UPDATE cars SET CAR_TYPE = ?, RED_CAR = ?, CAR_AGE = ?, DRIVER_ID = ? WHERE CAR_ID = ?";
                $statement = $connection->prepare($sql);
                $carId = $newCar->getCarId();
                $carType = $newCar->getCarType();
                $redCar = $newCar->getRedCar();
                $carAge = $newCar->getCarAge();
                $driverId = $newCar->getDriverId();
                $statement->bind_param('siiii', $carType, $redCar, $carAge, $driverId, $carId);
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
		    $sql = "DELETE FROM cars WHERE CAR_ID = ?";
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

        private function getAllCars()
        {
            global $dbserver, $dbusername, $dbpassword, $dbdatabase;

            $connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
            if (!$connection->connect_error)
            {
                $query = "SELECT CAR_ID, CAR_TYPE, RED_CAR, CAR_AGE, DRIVER_ID FROM cars";
                if ($result = $connection->query($query))
                {
                    while ($row = $result->fetch_assoc())
                    {
                        $this->cars[] = new Car($row["CAR_ID"], $row["CAR_TYPE"], $row["RED_CAR"], $row["CAR_AGE"], $row["DRIVER_ID"]);
                    }
                    $result->close();
                }
                $connection->close();
            }
        }   

        private function getCarById($id)
        {
            global $dbserver, $dbusername, $dbpassword, $dbdatabase;

            $connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
            if (!$connection->connect_error)
            {
                $query = "SELECT CAR_TYPE, RED_CAR, CAR_AGE, DRIVER_ID FROM cars WHERE CAR_ID = ?";
                $statement = $connection->prepare($query);
                $statement->bind_param('i', $id);
                $statement->execute();
                $statement->store_result();
                $statement->bind_result($carType, $redCar, $carAge, $driverId);
                if ($statement->fetch())
                {
                    return new Car($id, $carType, $redCar, $carAge, $driverId);
                }
                else
                {
                    return null;
                }
                $statement->close();
                $connection->close();
            }
        }

    	private function getCarByDriverId($driverId)
	{
	    global $dbserver, $dbusername, $dbpassword, $dbdatabase;

	    $connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
	    if (!$connection->connect_error)
            {
                $query = "SELECT CAR_ID, CAR_TYPE, RED_CAR, CAR_AGE, DRIVER_ID FROM cars WHERE DRIVER_ID = ?";
                $statement = $connection->prepare($query);
                $statement->bind_param('i', $driverId);
                $statement->execute();
                $result = $statement->get_result();

                $cars = array();
                while ($row = $result->fetch_assoc())
                {
                    $car = new Car($row['CAR_ID'], $row['CAR_TYPE'], $row['RED_CAR'], $row['CAR_AGE'], $row['DRIVER_ID']);
                    $cars[] = $car;
                }
                $statement->close();
                $connection->close();

                return $cars;
            }
        }

        private function extractCarFromJSON($requestBody)
        {
            $carArray = json_decode($requestBody, true);
            $car = new Car($carArray['CAR_ID'], 
                           $carArray['CAR_TYPE'], 
                           $carArray['RED_CAR'], 
                           $carArray['CAR_AGE'], 
                           $carArray['DRIVER_ID']);
            unset($carArray);
            return $car;
        }
    }
?>
