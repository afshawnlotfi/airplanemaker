import nevergrad as ng
from propeller import getThrust
import time
from concurrent import futures

def negThrust(blades : int, pitch : float, hub_diameter : float, diameter : float):
    return -getThrust(blades, pitch,hub_diameter, diameter)

parametrization = ng.p.Instrumentation(

    # an integer from 1 to 12
    blades=ng.p.Scalar(lower=1, upper=12).set_integer_casting(),

    # a log-distributed scalar between 0.001 and 1.0
    pitch=ng.p.Scalar(lower=0.1, upper=2.0),


    # a log-distributed scalar between 0.001 and 1.0
    hub_diameter=ng.p.Log(lower=1.0, upper=10.0),

    # a log-distributed scalar between 0.001 and 1.0
    diameter=ng.p.Log(lower=1.0, upper=10.0)


    # # either "conv" or "fc"
    # architecture=ng.p.Choice(["conv", "fc"])
)


start = time.time()


optimizer = ng.optimizers.NGO(parametrization=parametrization, budget=100, num_workers=4)
print(optimizer.num_workers)
with futures.ThreadPoolExecutor(max_workers=optimizer.num_workers) as executor:
   recommendation = optimizer.minimize(negThrust,  executor=executor, batch_mode=False)
   print(recommendation.value)

end = time.time()
print(end - start)